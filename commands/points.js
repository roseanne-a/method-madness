//take in team
const Pagination = require("customizable-discordjs-pagination");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
} = require("discord.js");

const knex = require("../src/db/connection");

const teamsJson = require("../src/db/seeds/00-teams.json");
const teams = teamsJson.map((team) => {
  return { name: team.name, value: team.name };
});

async function execute(interaction) {
  const choice = interaction.options.getString("team");
  const allSubmissions = await knex("teams as t")
    .select("t.*", "s.*", "m.name as method_name")
    .where({ "t.name": choice })
    .join("submissions as s", "s.team_id", "t.team_id")
    .join("methods as m", "s.method_id", "m.method_id");

  const infoAndSubmissions = [];

  const teamEmbed = new EmbedBuilder()
    .setColor("Random")
    .setTitle(
      allSubmissions[0].name + " - " + allSubmissions[0].points + "/16 points"
    )
    .setThumbnail(allSubmissions[0].mascot)
    .setDescription("\u200B")
    .addFields(
      {
        name: "\u200B",
        value: "\u200B",
        inline: true,
      },
      {
        name: "Leader",
        value: allSubmissions[0].leader,
        inline: true,
      },
      { name: "\u200B", value: "\u200B", inline: true },
      { name: "\u200B", value: "\u200B" },
      {
        name: "Member",
        value: allSubmissions[0].member1,
        inline: true,
      },
      { name: "Member", value: allSubmissions[0].member2, inline: true },
      {
        name: "Member",
        value: allSubmissions[0].member3,
        inline: true,
      },
      { name: "\u200B", value: "\u200B" }
    )
    .setImage()
    .setFooter({
      text: "Method Madness",
    });

  infoAndSubmissions.push(teamEmbed);

  for (let submission of allSubmissions) {
    let gameInfo;
    if (submission.game === null) {
      gameInfo = "";
    } else {
      gameInfo = "in " + submission.game + " ";
    }
    const submitEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(submission.method_name)
      .addFields(
        {
          name: `${submission.pokemon} was caught ${gameInfo}by ${submission.member}`,
          value: `using the ${submission.method_name} method.`,
        },
        { name: "Proof", value: submission.proof }
      )
      .setFooter({
        text: "Method Madness",
      });
    infoAndSubmissions.push(submitEmbed);
  }

  const buttons = [
    { label: "Previous", emoji: "⬅", style: ButtonStyle.Primary },
    { label: "Next", emoji: "➡", style: ButtonStyle.Primary },
  ];

  new Pagination()
    .setCommand(interaction)
    .setPages(infoAndSubmissions)
    .setButtons(buttons)
    .setPaginationCollector({ timeout: 120000 })
    .setFooter({ enable: true })
    .send();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Check points and status of a team")
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("choose a team to check")
        .setRequired(true)
        .addChoices(...teams)
    ),
  execute,
};
