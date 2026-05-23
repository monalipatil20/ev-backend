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
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 20),
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 2),
      retryWrites: true,
      w: 'majority',
    });

    console.log(`✓ MongoDB connected: ${connection.connection.host}`);
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
