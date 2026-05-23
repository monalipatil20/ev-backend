// MongoDB connection helper used by the new Express and Mongoose backend.
const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✓ MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`✗ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

const closeDB = async () => {
  // Close the active connection during graceful shutdown.
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

module.exports = {
  connectDB,
  closeDB,
};
