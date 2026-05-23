// Delegator service: chooses MongoDB or MySQL implementation based on DB_TYPE
const db = require('../../config/database');

const mongo = require('./auth.mongodb');
const mysql = require('./auth.mysql');

const DB_TYPE = process.env.DB_TYPE || db.DB_TYPE || 'mongodb';

module.exports = {
  registerUser: async (userData) => {
    if (DB_TYPE === 'mysql') return await mysql.registerUser(userData);
    return await mongo.registerUser(userData);
  },
  loginUser: async (email, password) => {
    if (DB_TYPE === 'mysql') return await mysql.loginUser(email, password);
    return await mongo.loginUser(email, password);
  },
  getUserProfile: async (userId) => {
    if (DB_TYPE === 'mysql') return await mysql.getUserProfile(userId);
    return await mongo.getUserProfile(userId);
  },
  updateUserProfile: async (userId, updateData) => {
    if (DB_TYPE === 'mysql') return await mysql.updateUserProfile(userId, updateData);
    return await mongo.updateUserProfile(userId, updateData);
  },
};
