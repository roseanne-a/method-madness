const {
  ActionRowBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const knex = require("../src/db/connection");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createteam")
    .setDescription(
      "Submit your team! Only members' Twitch username is optional."
    )
    .addStringOption((option) =>
      option
        .setName("leader")
        .setDescription("Input your leader's name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("leader_twitch")
        .setDescription("Input leader's Twitch name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("member1")
        .setDescription("Input a team member")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("member2")
        .setDescription("Input another team member")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("member3")
        .setDescription("Input a last team member")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("team_name")
        .setDescription("Enter a team name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("mascot")
        .setDescription("Submit image link of team mascot")
    )
    .addStringOption((option) =>
      option
        .setName("member1_twitch")
        .setDescription(
          "If member 1 has a twitch, input the username (optional)"
        )
    )
    .addStringOption((option) =>
      option
        .setName("member2_twitch")
        .setDescription(
          "If member 2 has a twitch, input the username (optional)"
        )
    )
    .addStringOption((option) =>
      option
        .setName("member3_twitch")
        .setDescription(
          "If member 3 has a twitch, input the username (optional)"
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    let leader = interaction.options.getString("leader");
    let leader_twitch = interaction.options.getString("leader_twitch");
    let member1 = interaction.options.getString("member1");
    let member1_twitch = interaction.options.getString("member1_twitch");
    let member2 = interaction.options.getString("member2");
    let member2_twitch = interaction.options.getString("member2_twitch");
    let member3 = interaction.options.getString("member3");
    let member3_twitch = interaction.options.getString("member3_twitch");
    const team_name = interaction.options.getString("team_name");
    const mascot = interaction.options.getString("mascot");

    if (!mascot) mascot = "https://i.imgur.com/Xx3hHU4.gif";

    const newTeam = {
      name: team_name,
      leader,
      leader_twitch,
      member1,
      member1_twitch,
      member2,
      member2_twitch,
      member3,
      member3_twitch,
      mascot,
    };

    await knex("teams").insert(newTeam);

    let m1t = false;
    let m2t = false;
    let m3t = false;

    if (!member1_twitch) {
      member1_twitch = "";
      m1t = true;
    }
    if (!member2_twitch) {
      member2_twitch = "";
      m2t = true;
    }
    if (!member3_twitch) {
      member3_twitch = "";
      m3t = true;
    }

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(leader)
          .setURL(`https://twitch.tv/${leader_twitch}`)
          .setStyle(ButtonStyle.Link)
          .setDisabled(false)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel(member1)
          .setURL(`https://twitch.tv/${member1_twitch}`)
          .setStyle(ButtonStyle.Link)
          .setDisabled(m1t)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel(member2)
          .setURL(`https://twitch.tv/${member2_twitch}`)
          .setStyle(ButtonStyle.Link)
          .setDisabled(m2t)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel(member3)
          .setURL(`https://twitch.tv/${member3_twitch}`)
          .setStyle(ButtonStyle.Link)
          .setDisabled(m3t)
      );

    const teamEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Welcome to the madness!")
      .addFields(
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        { name: team_name, value: " " },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name: "Leader",
          value: leader,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        { name: "\u200B", value: "\u200B" },
        {
          name: "Member",
          value: member1,
          inline: true,
        },
        { name: "Member", value: member2, inline: true },
        {
          name: "Member",
          value: member3,
          inline: true,
        }
      )
      .setImage(mascot)
      .setFooter({
        text: "Method Madness",
      });

    const channel = await interaction.client.channels.fetch(
      "1013796000881725491"
    );
    await channel.send({
      embeds: [teamEmbed],
      components: [row],
    });

    await interaction.reply({
      content: `The team has been created.`,
      embeds: [teamEmbed],
      components: [row],
    });
  },
};
