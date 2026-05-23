// Compatibility layer for older modules that still import the legacy database helper.
const mongoose = require('mongoose');
const { connectDB, closeDB } = require('./db');

const DB_TYPE = 'mongodb';

async function initDatabases() {
  // Preserve the old function name while routing everything through the new Mongo-only setup.
  await connectDB();
  return { DB_TYPE, mongoose, sequelize: null };
}

function getSequelize() {
  return null;
}

function getMongoose() {
  return mongoose;
}

module.exports = {
  initDatabases,
  getSequelize,
  getMongoose,
  DB_TYPE,
  closeDB,
};
