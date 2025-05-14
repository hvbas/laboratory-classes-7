const { MongoClient } = require('mongodb');
const { MONGODB_URI, DB_NAME } = require('./config');

const client = new MongoClient(MONGODB_URI);

let _db;

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    _db = client.db(DB_NAME); // Database name
    return _db;
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    throw error;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database connection established!');
};

module.exports = {
  connectToDatabase,
  getDb
};
