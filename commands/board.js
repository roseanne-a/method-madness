const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

const knex = require("../src/db/connection");

const teamsJson = require("../src/db/seeds/00-teams.json");
const teams = teamsJson.map((team) => {
  return { name: team.name, value: team.name };
});

async function execute(interaction) {
  const choice = interaction.options.getString("team");

  const allSubmissions = await knex("submissions as s")
    .select(
      "t.name as team_name",
      "s.*",
      "m.name as method_name",
      "m.row",
      "m.column"
    )
    .where({ "t.name": choice })
    .join("teams as t", "s.team_id", "t.team_id")
    .join("methods as m", "s.method_id", "m.method_id");

  const canvas = Canvas.createCanvas(600, 687);
  const context = canvas.getContext("2d");

  const bingoBoard = await Canvas.loadImage("./BingoBoard.png");
  const bingoMarker = await Canvas.loadImage("./bingomarker.png");

  const applyText = (canvas, text) => {
    const context = canvas.getContext("2d");

    // Declare a base size of the font
    let fontSize = 70;

    do {
      // Assign the font to the context and decrement it so it can be measured again
      context.font = `${(fontSize -= 10)}px tahoma`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width);

    // Return the result to use in the actual canvas
    return context.font;
  };

  context.font = applyText(canvas, choice);
  context.fillStyle = "#21B6A8";
  context.textAlign = "center";

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  context.drawImage(bingoBoard, 0, 0, canvas.width, canvas.height);
  context.fillText(choice, canvas.width / 2, 100);
  if (allSubmissions.length > 0) {
    for (let i = 0; i < allSubmissions.length; i++) {
      context.drawImage(
        bingoMarker,
        allSubmissions[i].row,
        allSubmissions[i].column,
        135,
        135
      );
    }
  }
  // Use the helpful Attachment class structure to process the file for you
  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "bingoboard.png",
  });

  interaction.reply({ files: [attachment] });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("board")
    .setDescription("Check bingo board of a team")
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("choose a team to check")
        .setRequired(true)
        .addChoices(...teams)
    ),
  execute,
};
