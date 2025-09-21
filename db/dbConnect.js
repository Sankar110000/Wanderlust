const mongoose = require("mongoose");
require('dotenv').config({ path: '../.env' });

async function dbConnection() {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.ATLASDB_URL}/wanderlust` || ``);
    console.log("Connection Successful", connectionInstance.connections[0].host);
  } catch (err) {
    console.log("Error connecting the database : ", err);
    process.exit(1);
  }
}

module.exports = dbConnection;
