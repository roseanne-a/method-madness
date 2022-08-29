const { SlashCommandBuilder } = require("discord.js");
const knex = require("../src/db/connection");

const teamsJson = require("../src/db/seeds/00-teams.json");
const teams = teamsJson.map((team) => {
  return { name: team.name, value: team.name };
});

const methodsJson = require("../src/db/seeds/01-methods.json");
const methods = methodsJson.map((method) => {
  return { name: method.name, value: method.name };
});

const command = new SlashCommandBuilder()
  .setName("submit")
  .setDescription("Submit your shinies! All options except game are required.")
  .addStringOption((option) =>
    option
      .setName("team")
      .setDescription("Select your team")
      .setRequired(true)
      .addChoices(...teams)
  )
  .addStringOption((option) =>
    option
      .setName("member")
      .setDescription("Select team member who caught the Pokemon")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("method")
      .setDescription("Select method used")
      .setRequired(true)
      .setChoices(...methods)
  )
  .addStringOption((option) =>
    option
      .setName("pokemon")
      .setDescription("What Pokemon did you catch?")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("proof")
      .setDescription("Submit photo or video proof URL")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("other_pics")
      .setDescription("Submit the rest of your photo proof")
  )
  .addStringOption((option) =>
    option.setName("game").setDescription("What game did you find it in?")
  );

module.exports = {
  data: command,
  async execute(interaction) {
    const team = interaction.options.getString("team");
    const member = interaction.options.getString("member");
    const method = interaction.options.getString("method");
    const pokemon = interaction.options.getString("pokemon");
    const proof = interaction.options.getString("proof");
    const other_proof = interaction.options.getString("other_pics");
    let game = interaction.options.getString("game");

    if (!game) game = null;

    const teamChosen = await knex("teams")
      .select("team_id")
      .where({ name: team })
      .first();

    const method_id = await knex("methods")
      .select("method_id")
      .where({ name: method })
      .first();

    const allTeamSubmissions = await knex("submissions")
      .select("method_id")
      .where({ team_id: teamChosen.team_id, approved: true });

    const newSubmission = {
      team_id: teamChosen.team_id,
      member,
      method_id: method_id.method_id,
      pokemon: pokemon,
      proof: proof,
      other_proof,
      game: game,
    };

    if (
      allTeamSubmissions.find(
        (methodDone) => methodDone.method_id === method_id.method_id
      )
    ) {
      await interaction.reply({
        content:
          "You have already submitted and have been approved for a shiny for that method, please try again with a different method.",
      });
    } else {
      await knex("submissions").insert(newSubmission);

      const modChannel = await interaction.client.channels.fetch(
        "1009467243949740183"
      );

      await modChannel.send({ content: "A new submission is in /queue." });

      await interaction.reply({
        content:
          "Your submission has been added to the queue and will be reviewed by the mod team. It will be displayed in #submissions when it is successful or contacted if there is an issue.",
      });
    }
  },
};
