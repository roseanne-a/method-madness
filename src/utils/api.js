const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri);

async function addTeam(team) {
  try {
    const database = client.db("method_madness");
    const teamsCollection = database.collection("teams");
    // create a document to insert
    const result = await teamsCollection.insertOne(team);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } catch (e) {
    console.log(e);
  }
}

async function approveTeam(team) {
  try {
    const database = client.db("method_madness");
    const teamsCollection = database.collection("teams");

    const filter = { team: team };
    const approval = {
      $set: {
        approved: true,
      },
    };

    await teamsCollection.updateOne(filter, approval);
    console.log(`This team has been approved.`);
  } catch (e) {
    console.log(e);
  }
}

async function denyTeam(team) {
  try {
    const database = client.db("method_madness");
    const teamsCollection = database.collection("teams");

    const filter = { team: team };
    const denial = {
      $set: {
        hide: true,
      },
    };

    await teamsCollection.updateOne(filter, denial);
    console.log(`This team has been denied.`);
  } catch (e) {
    console.log(e);
  }
}

async function getAllTeams() {
  try {
    const database = client.db("method_madness");
    const teamsCollection = database.collection("teams");
    let result = teamsCollection.find({ approved: false, hide: false });
    let results = [];

    for await (const doc of result) {
      results.push(doc);
    }
    return results;
  } catch (e) {
    console.log(e);
  }
}

async function getTeam(name) {
  try {
    const database = client.db("method_madness");
    const teamsCollection = database.collection("teams");
    let result = await teamsCollection.findOne({ team: name });
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { addTeam, approveTeam, denyTeam, getAllTeams, getTeam };
