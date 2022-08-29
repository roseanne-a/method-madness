/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("teams", (table) => {
    table.increments("team_id").primary();
    table.string("name");
    table.string("leader");
    table.string("leader_twitch");
    table.string("member1");
    table.string("member1_twitch");
    table.string("member2");
    table.string("member2_twitch");
    table.string("member3");
    table.string("member3_twitch");
    table.string("mascot").defaultTo("https://i.imgur.com/Xx3hHU4.gif");
    table.integer("points").defaultTo(0);
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("teams");
};
