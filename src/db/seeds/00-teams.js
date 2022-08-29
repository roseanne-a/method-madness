const teams = require("./00-teams.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE teams RESTART IDENTITY CASCADE")
    .then(() => knex("teams").insert(teams));
};
