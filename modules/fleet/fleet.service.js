// Delegator service: chooses MongoDB or MySQL implementation based on DB_TYPE
const db = require('../../config/database');

const mongo = require('./fleet.mongodb');
const mysql = require('./fleet.mysql');

const DB_TYPE = process.env.DB_TYPE || db.DB_TYPE || 'mongodb';

module.exports = {
  registerFleet: async (fleetManagerId, fleetData) => {
    if (DB_TYPE === 'mysql') return await mysql.registerFleet(fleetManagerId, fleetData);
    return await mongo.registerFleet(fleetManagerId, fleetData);
  },
  getFleetDetails: async (fleetManagerId) => {
    if (DB_TYPE === 'mysql') return await mysql.getFleetDetails(fleetManagerId);
    return await mongo.getFleetDetails(fleetManagerId);
  },
  getAllFleets: async (filters) => {
    if (DB_TYPE === 'mysql') return await mysql.getAllFleets(filters);
    return await mongo.getAllFleets(filters);
  },
  updateFleet: async (fleetManagerId, updateData) => {
    if (DB_TYPE === 'mysql') return await mysql.updateFleet(fleetManagerId, updateData);
    return await mongo.updateFleet(fleetManagerId, updateData);
  },
  verifyFleet: async (fleetId) => {
    if (DB_TYPE === 'mysql') return await mysql.verifyFleet(fleetId);
    return await mongo.verifyFleet(fleetId);
  },
};
