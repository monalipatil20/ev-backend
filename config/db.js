// MongoDB connection helper used by the new Express and Mongoose backend.
const mongoose = require('mongoose');
const appConfig = require('./env');

const connectDB = async () => {
  const uri = appConfig.database.uri;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment configuration');
  }

  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(uri, {
      autoIndex: appConfig.database.autoIndex,
      serverSelectionTimeoutMS: appConfig.database.serverSelectionTimeoutMS,
      maxPoolSize: appConfig.database.maxPoolSize,
      minPoolSize: appConfig.database.minPoolSize,
      retryWrites: appConfig.database.retryWrites,
      w: 'majority',
    });

    const maskedUri = uri.replace(/:[^:@]+@/, ':***@');
    console.log(`✓ MongoDB connected: ${connection.connection.host}`);
    if (appConfig.features.debugLogs) {
      console.log(`  Connection URI: ${maskedUri}`);
      console.log(`  Pool Size: ${appConfig.database.minPoolSize}-${appConfig.database.maxPoolSize}`);
    }
    return connection;
  } catch (error) {
    console.error(`✗ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

module.exports = {
  connectDB,
  closeDB,
};
