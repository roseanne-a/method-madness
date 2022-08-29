const submissions = require("./02-submissions.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE submissions RESTART IDENTITY CASCADE")
    .then(() => knex("submissions").insert(submissions));
};
