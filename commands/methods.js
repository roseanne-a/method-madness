//edit methods descriptions

const knex = require("../src/db/connection");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const methodsJson = require("../src/db/seeds/01-methods.json");
const methods = methodsJson.map((method) => {
  return { name: method.name, value: method.name };
});

async function execute(interaction) {
  const choice = interaction.options.getString("method");
  const foundMethod = methodsJson.find((method) => method.name === choice);

  const methodEmbed = new EmbedBuilder()
    .setColor("Random")
    .setTitle(foundMethod.name)
    .addFields(
      {
        name: `Games you can hunt in`,
        value: foundMethod.games,
      },
      { name: "Proof needed", value: foundMethod.evidence }
    )
    .setFooter({
      text: "Method Madness",
    });

  await interaction.reply({
    content:
      "Base evidence: Video evidence of restore or capture  OR Screenshot of hunt start date (can be your game in front of restore or during battle on which pokemon is obtained but must feature the non shiny pokemon or before you commence trainer in overworld. + Shiny once obtained in either nickname screen, battle or summary screen with the date obtained. If the game doesn’t have the feature to show the date take a picture with a device that can accurately display the current date.",
    embeds: [methodEmbed],
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("methods")
    .setDescription("What method are you interested in?")
    .addStringOption((option) =>
      option
        .setName("method")
        .setDescription("choose a method to check")
        .setRequired(true)
        .addChoices(...methods)
    ),
  execute,
};
