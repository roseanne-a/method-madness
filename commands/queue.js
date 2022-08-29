const Pagination = require("customizable-discordjs-pagination");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

const knex = require("../src/db/connection");

async function execute(interaction) {
  const submissions = await knex("submissions as s")
    .select("s.*", "m.name as method_name", "t.name as team_name")
    .where({ "s.approved": false })
    .join("teams as t", "t.team_id", "s.team_id")
    .join("methods as m", "m.method_id", "s.method_id");

  if (!submissions || submissions.length === 0)
    return await interaction.reply({
      content:
        "There are no items in queue right now. If you think this is an error please contact rosey.",
    });

  const submissionsQueue = [];
  for (let submission of submissions) {
    let gameInfo;
    if (submission.game === null) {
      gameInfo = "";
    } else {
      gameInfo = "in " + submission.game + " ";
    }
    const submitEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(submission.team_name + "'s submission")
      .setDescription(`Submission ID: ${submission.submission_id}`)
      .addFields(
        {
          name: `${submission.pokemon} was caught ${gameInfo}by ${submission.member}`,
          value: `using the ${submission.method_name} method.`,
        },

        { name: "Proof", value: submission.proof },
        { name: "\u200B", value: "\u200B" },
        {
          name: "To approve or deny submissions, please do /approve",
          value:
            "and choose all or the submission ID you want to approve, separated by spaces in the options. Anything not approved will not be posted.",
        }
      )
      .setTimestamp()
      .setFooter({
        text: "Method Madness",
      });

    submissionsQueue.push(submitEmbed);
  }

  const buttons = [
    { label: "Previous", emoji: "⬅", style: ButtonStyle.Primary },
    { label: "Next", emoji: "➡", style: ButtonStyle.Primary },
  ];

  new Pagination()
    .setCommand(interaction)
    .setPages(submissionsQueue)
    .setButtons(buttons)
    .setPaginationCollector({ timeout: 120000 })
    .setFooter({ enable: true })
    .send();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("See teams in queue")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  execute,
};
