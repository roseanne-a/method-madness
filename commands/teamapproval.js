const {
  ActionRowBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ComponentType,
  PermissionFlagsBits,
} = require("discord.js");
const { Pagination } = require("pagination.djs");

const {
  getAllTeams,
  approveTeam,
  denyTeam,
  getTeam,
} = require("../src/utils/api.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("approveteam")
    .setDescription("Approves or denies a new team.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    let teams = await getAllTeams();

    if (!teams || teams.length === 0)
      return await interaction.reply({
        content:
          "There are no teams in queue right now. If you think this is an error please contact Rosey.",
      });

    let teamQueue = [];
    for (let team of teams) {
      const submitEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Team: " + team.team)
        .setDescription(`Team ID: ${team._id}`)
        .addFields(
          {
            name: "Leader",
            value: `${team.leader}: ${team.leaderPromo}`,
          },
          { name: "\u200B", value: "\u200B", inline: true },
          {
            name: "Member 1",
            value: `${team.memberOne}: ${team.memberOnePromo}`,
          },
          {
            name: "Member 2",
            value: `${team.memberTwo}: ${team.memberTwoPromo}`,
          },
          {
            name: "Member 3",
            value: `${team.memberThree}: ${team.memberThreePromo}`,
          },
          { name: "Mascot", value: `${team.mascot}` }
        )
        .setTimestamp()
        .setFooter({
          text: "Method Madness",
        });

      teamQueue.push(submitEmbed);
    }

    const pagination = new Pagination(interaction, {
      prevEmoji: "◀️", // Previous button emoji
      nextEmoji: "▶️", // Next button emoji

      idle: 30000, // idle time in ms before the pagination closes
    });

    const approve = new ButtonBuilder()
      .setCustomId("approve")
      .setLabel("✔")
      .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
      .setCustomId("deny")
      .setLabel("✖")
      .setStyle(ButtonStyle.Danger);

    pagination.addActionRows([
      new ActionRowBuilder().addComponents(approve, deny),
    ]);

    pagination.setEmbeds(teamQueue, (embed, index, array) => {
      return embed.setFooter({
        text: `Page: ${index + 1}/${array.length}`,
      });
    });
    const payloads = pagination.ready();
    const response = await interaction.reply(payloads);
    pagination.paginate(response);

    const collectorFilter = (i) => i.user.id === interaction.user.id;
    const collector = response.createMessageComponentCollector({
      filter: collectorFilter,
      componentType: ComponentType.Button,
      time: 3_600_000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "approve") {
        let teamName =
          pagination.embeds[pagination.currentPage - 1].data.title.substring(6);
        await approveTeam(teamName);
        await i.reply("That team has been approved!");

        const approvedTeam = await getTeam(teamName);

        console.log(approvedTeam);

        let m1t = false;
        let m2t = false;
        let m3t = false;

        if (
          !approvedTeam.memberOnePromo ||
          approvedTeam.memberOnePromo.length < 1 ||
          approvedTeam.memberOnePromo.substring(0, 4).toLowerCase() !== "http"
        ) {
          approvedTeam.memberOnePromo = "http://twitch.tv";
          m1t = true;
        }
        if (
          !approvedTeam.memberTwoPromo ||
          approvedTeam.memberTwoPromo.length < 1 ||
          approvedTeam.memberTwoPromo.substring(0, 4).toLowerCase() !== "http"
        ) {
          approvedTeam.memberTwoPromo = "http://twitch.tv";
          m2t = true;
        }
        if (
          !approvedTeam.memberThreePromo ||
          approvedTeam.memberThreePromo.length < 1 ||
          approvedTeam.memberThreePromo.substring(0, 4).toLowerCase() !== "http"
        ) {
          approvedTeam.memberThreePromo = "http://twitch.tv";
          m3t = true;
        }

        if (
          !approvedTeam.mascot ||
          approvedTeam.mascot.length < 1 ||
          approvedTeam.mascot.substring(0, 4).toLowerCase() !== "http"
        )
          approvedTeam.mascot =
            "https://media.tenor.com/Ny3gqWeXc38AAAAC/shiny-ditto-dance.gif";
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel(approvedTeam.leader)
              .setURL(approvedTeam.leaderPromo)
              .setStyle(ButtonStyle.Link)
              .setDisabled(false)
          )
          .addComponents(
            new ButtonBuilder()
              .setLabel(approvedTeam.memberOne)
              .setURL(approvedTeam.memberOnePromo)
              .setStyle(ButtonStyle.Link)
              .setDisabled(m1t)
          )
          .addComponents(
            new ButtonBuilder()
              .setLabel(approvedTeam.memberTwo)
              .setURL(approvedTeam.memberTwoPromo)
              .setStyle(ButtonStyle.Link)
              .setDisabled(m2t)
          )
          .addComponents(
            new ButtonBuilder()
              .setLabel(approvedTeam.memberThree)
              .setURL(approvedTeam.memberThreePromo)
              .setStyle(ButtonStyle.Link)
              .setDisabled(m3t)
          );

        const teamEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("Team " + approvedTeam.team)
          .addFields(
            {
              name: "\u200B",
              value: "\u200B",
              inline: true,
            },
            {
              name: "Leader",
              value: approvedTeam.leader,
              inline: true,
            },
            { name: "\u200B", value: "\u200B", inline: true },
            { name: "\u200B", value: "\u200B" },
            {
              name: "Member",
              value: approvedTeam.memberOne,
              inline: true,
            },
            { name: "Member", value: approvedTeam.memberTwo, inline: true },
            {
              name: "Member",
              value: approvedTeam.memberThree,
              inline: true,
            }
          )
          .setImage(approvedTeam.mascot)
          .setFooter({
            text: "Method Madness",
          });

        const channel = await interaction.client.channels.fetch(
          "1138605476414750785"
        );
        await channel.send({
          embeds: [teamEmbed],
          components: [row],
        });
      } else if (i.customId === "deny") {
        let teamName =
          pagination.embeds[pagination.currentPage - 1].data.title.substring(6);
        await denyTeam(teamName);
        await i.reply("That team has been denied.");
      }
    });
  },
};
