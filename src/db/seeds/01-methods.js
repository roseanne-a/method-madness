const methods = require("./01-methods.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE methods RESTART IDENTITY CASCADE")
    .then(() => knex("methods").insert(methods));
};
