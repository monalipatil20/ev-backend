// MongoDB connection helper used by the new Express and Mongoose backend.
const mongoose = require('mongoose');

let reconnectAttempts = 0;
let reconnectTimer = null;

const getReconnectDelay = () => {
  const baseDelayMs = Number(process.env.MONGO_RECONNECT_BASE_MS || 2000);
  const maxDelayMs = Number(process.env.MONGO_RECONNECT_MAX_MS || 30000);
  const calculated = baseDelayMs * Math.max(1, reconnectAttempts);
  return Math.min(calculated, maxDelayMs);
};

const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const scheduleReconnect = () => {
  clearReconnectTimer();
  reconnectAttempts += 1;
  const delay = getReconnectDelay();

  reconnectTimer = setTimeout(async () => {
    try {
      await connectDB();
    } catch (error) {
      console.error(`✗ MongoDB reconnect attempt ${reconnectAttempts} failed: ${error.message}`);
      scheduleReconnect();
    }
  }, delay);
};

const registerConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    reconnectAttempts = 0;
    clearReconnectTimer();
    console.log('✓ MongoDB connection established');
  });

  mongoose.connection.on('reconnected', () => {
    reconnectAttempts = 0;
    clearReconnectTimer();
    console.log('✓ MongoDB connection re-established');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`✗ MongoDB error: ${error.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB disconnected. Attempting reconnect...');
    if (process.env.NODE_ENV !== 'test') {
      scheduleReconnect();
    }
  });
};

let eventsRegistered = false;

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

    if (!eventsRegistered) {
      registerConnectionEvents();
      eventsRegistered = true;
    }

    console.log(`✓ MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`✗ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

const closeDB = async () => {
  // Close the active connection during graceful shutdown.
  clearReconnectTimer();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

module.exports = {
  connectDB,
  closeDB,
};
