/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("methods", (table) => {
    table.increments("method_id").primary();
    table.string("name");
    table.text("description", "longtext");
    table.string("url");
    table.text("games", "longtext");
    table.text("evidence", "longtext");
    table.integer("row");
    table.integer("column");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("methods");
};
