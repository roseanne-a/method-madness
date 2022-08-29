/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("submissions", (table) => {
    table.increments("submission_id").primary();
    table.integer("method_id").unsigned().notNullable();
    table
      .foreign("method_id")
      .references("method_id")
      .inTable("methods")
      .onDelete("CASCADE");
    table.integer("team_id").unsigned().notNullable();
    table
      .foreign("team_id")
      .references("team_id")
      .inTable("teams")
      .onDelete("CASCADE");
    table.string("member");
    table.string("game");
    table.string("pokemon");
    table.string("proof");
    table.string("other_proof");
    table.boolean("approved").defaultTo(false);

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("submissions");
};
