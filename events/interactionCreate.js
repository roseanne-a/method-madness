const knex = require("../src/db/connection");
module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      // console.log(interaction);
      // console.log(
      //   `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
      // );
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    } else if (interaction.isSelectMenu()) {
      const listOfMethods = await knex("methods").select("*");
      const cmd = interaction.values[0];

      for (const method of listOfMethods) {
        if (method.name === cmd)
          await interaction.reply({
            content: method.description,
          });
      }
    } else if (interaction.isModalSubmit()) console.log(interaction);
  },
};
