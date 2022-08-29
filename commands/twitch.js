const knex = require("../src/db/connection");
require("dotenv").config();
require;

const TwitchApi = require("node-twitch").default;
const { twitch_client_id, client_secret } = process.env; // remove this after you've confirmed it working
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("twitch")
    .setDescription("starts the twitch updates")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const twitch = new TwitchApi({
      client_id: twitch_client_id,
      client_secret: client_secret,
    });

    let lastOnlineStreams = [];
    let newOnlineStreams = [];

    const allTeams = await knex("teams").select(
      "name",
      "leader_twitch",
      "member1_twitch",
      "member2_twitch",
      "member3_twitch"
    );

    const arrayOfUsers = [];
    for (let team of allTeams) {
      arrayOfUsers.push(team.leader_twitch);
      if (team.member1_twitch) arrayOfUsers.push(team.member1_twitch);
      if (team.member2_twitch) arrayOfUsers.push(team.member2_twitch);
      if (team.member3_twitch) arrayOfUsers.push(team.member3_twitch);
    }

    const sendTwitchLive = async () => {
      lastOnlineStreams = newOnlineStreams;
      newOnlineStreams = [];
      let { data } = await twitch.getStreams({ channels: arrayOfUsers });

      for (let index = 0; index < data.length; index++) {
        const alreadyOnline = lastOnlineStreams.find(
          (stream) => stream.user_name === data[index].user_name
        );
        if (alreadyOnline) newOnlineStreams.push(alreadyOnline);
        else if (
          !lastOnlineStreams.find(
            (stream) => stream.user_name === data[index].user_name
          )
        ) {
          let foundTeam = allTeams.filter(
            (team) =>
              team.leader_twitch === data[index].user_name.toLowerCase() ||
              team.member1_twitch === data[index].user_name.toLowerCase() ||
              team.member2_twitch === data[index].user_name.toLowerCase() ||
              team.member3_twitch === data[index].user_name.toLowerCase()
          );

          newOnlineStreams.push(data[index]);
          const announceEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(
              `${data[index].user_name} from ${foundTeam[0].name} from has gone live!`
            )
            .setDescription(data[index].title)
            .addFields({
              name: `Playing`,
              value: data[index].game_name,
            })
            .setImage(data[index].getThumbnailUrl())
            .setTimestamp()
            .setFooter({
              text: "Method Madness",
            });
          let channel = await interaction.client.channels.fetch(
            "1013821572517216317"
          );
          await channel.send({ embeds: [announceEmbed] });
        }
      }
    };
    setInterval(sendTwitchLive, 10000);
    await interaction.reply("started");
  },
};
