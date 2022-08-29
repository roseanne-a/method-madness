//edit role pinged and channel sent

const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const knex = require("../src/db/connection");

async function execute(interaction) {
  const choices = interaction.options.getString("options");

  let approvalIds = [];
  let submissionsChosen = choices.split(" ");

  if (choices === "all") {
    approvalIds = await knex("submissions")
      .where({ approved: false })
      .update({ approved: true }, ["submission_id", "team_id"]);
  } else {
    for (let submissionId of submissionsChosen) {
      let returningId = await knex("submissions")
        .where({ submission_id: submissionId, approved: false })
        .update({ approved: true }, ["submission_id", "team_id"])
        .then((result) => result[0]);

      if (!returningId)
        return await interaction.reply({
          content:
            "Nothing was updated because the numbers you entered have already been approved or the submission ID is not valid.",
        });

      approvalIds.push(returningId);
    }
  }

  await interaction.reply({
    content: "Approved submissions are being processed now.",
  });

  const channel = await interaction.client.channels.fetch(
    "1004019494089404509"
  );

  const modChannel = await interaction.client.channels.fetch(
    "1009467243949740183"
  );

  for (let approvedId of approvalIds) {
    await knex("teams")
      .where({ team_id: approvedId.team_id })
      .increment("points", 1);

    const approved = await knex("submissions as s")
      .select(
        "s.*",
        "m.name as method_name",
        "t.name as team_name",
        "t.points as points"
      )
      .where({ "s.submission_id": approvedId.submission_id })
      .join("teams as t", "t.team_id", "s.team_id")
      .join("methods as m", "m.method_id", "s.method_id")
      .first();

    let gameInfo;
    if (approved.game === null) {
      gameInfo = "";
    } else {
      gameInfo = "in " + approved.game + " ";
    }

    if (/\.(jpe?g|png|gif|webp)$/i.test(approved.proof)) {
      const submissionEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(approved.team_name + " has found a shiny!")
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/915263823907282944.webp"
        )
        .addFields(
          {
            name: `${approved.pokemon} was caught ${gameInfo}by ${approved.member}`,
            value: `using the ${approved.method_name} method!`,
          },
          {
            name: `Points`,
            value: `They now have ${approved.points} points!`,
          }
        )
        .setImage(approved.proof)
        .setTimestamp()
        .setFooter({
          text: "Method Madness",
        });

      await channel.send({
        content: "Check it out!",
        embeds: [submissionEmbed],
      });
    } else if (/\.(mp4|avi)$/i.test(approved.proof)) {
      const submissionEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(approved.team_name + " has found a shiny!")
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/915263823907282944.webp"
        )
        .addFields({
          name: `${approved.pokemon} was caught ${gameInfo}by ${approved.member}`,
          value: `using the ${approved.method_name} method!`,
        })
        .setTimestamp()
        .setFooter({
          text: "Method Madness",
        });

      const file = new AttachmentBuilder(approved.proof);

      try {
        await channel.send({
          content: "Check it out!",
          embeds: [submissionEmbed],
          files: [file],
        });
      } catch (e) {
        modChannel.send({
          content: "There was an error.",
        });
      }
    } else {
      const submissionEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(approved.team_name + " has found a shiny!")
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/915263823907282944.webp"
        )
        .addFields({
          name: `${approved.pokemon} was caught ${gameInfo}by ${approved.member}`,
          value: `using the ${approved.method_name} method!`,
        })
        .setTimestamp()
        .setFooter({
          text: "Method Madness",
        });

      await channel.send({
        content: approved.proof,
        embeds: [submissionEmbed],
      });
    }
  }
  await channel.send({
    content: "<@1009457536526721136>",
  });
  return modChannel.send({
    content: "The submission(s) have been approved and posted.",
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("approve")
    .setDescription("Approve of submissions")
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("all or submission number(s) separated by spaces")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  execute,
};
