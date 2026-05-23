// Main server entrypoint for the MongoDB-backed Express API.
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const { connectDB, closeDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chargingRoutes = require('./routes/chargingRoutes');
const cafeRoutes = require('./routes/cafeRoutes');
const fleetRoutes = require('./routes/fleetRoutes');
const showroomRoutes = require('./routes/showroomRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const gpsRoutes = require('./routes/gpsRoutes');
const landingRoutes = require('./routes/landingRoutes');
const userRoutes = require('./routes/userRoutes');
const driverRoutes = require('./routes/driverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const dealershipRoutes = require('./modules/dealership/dealership.routes');
const apiRoutes = require('./routes');
const ApiError = require('./utils/ApiError');
const errorMiddleware = require('./middleware/errorMiddleware');
const { initializeGpsSocket } = require('./socket/gpsSocket');

const app = express();
const PORT = process.env.PORT || 5001;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const execFileAsync = promisify(execFile);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getListeningPids = async (port) => {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execFileAsync('cmd', ['/c', `netstat -ano -p tcp | findstr :${port}`]);
      return stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => /LISTENING|LISTEN/.test(line))
        .map((line) => {
          const match = line.match(/\s(\d+)$/);
          return match ? match[1] : null;
        })
        .filter(Boolean);
    }

    const { stdout } = await execFileAsync('sh', ['-lc', `lsof -ti tcp:${port}`]);
    return stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    return [];
  }
};

const killPid = async (pid) => {
  try {
    if (process.platform === 'win32') {
      await execFileAsync('taskkill', ['/PID', String(pid), '/T', '/F']);
      return true;
    }

    await execFileAsync('kill', ['-TERM', String(pid)]);
    return true;
  } catch (error) {
    console.warn(`[PORT] Could not stop PID ${pid}: ${error.message}`);
    return false;
  }
};

const freePort = async (port) => {
  const pids = await getListeningPids(port);

  if (!pids.length) {
    return false;
  }

  console.log(`[PORT] Port ${port} is in use by PID(s): ${pids.join(', ')}`);

  for (const pid of pids) {
    await killPid(pid);
  }

  await delay(500);

  const remaining = await getListeningPids(port);
  if (remaining.length) {
    throw new Error(`Port ${port} is still busy after cleanup: ${remaining.join(', ')}`);
  }

  console.log(`[PORT] Port ${port} is now free`);
  return true;
};

const listenOnPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    initializeGpsSocket(server, corsOptions);

    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };

    const onListening = () => {
      server.off('error', onError);
      resolve(server);
    };

    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port);
  });
};

// Keep the CORS setup flexible enough for Expo development and production hosts.
const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = {
  origin: !corsOrigin || corsOrigin === '*' ? true : corsOrigin.split(',').map((value) => value.trim()),
  credentials: true,
};

// Core middleware for JSON payloads, form submissions, and cross-origin requests.
app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.JSON_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded assets when the project starts storing media files.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple request trace for local debugging without adding a logging dependency.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root health check gives a quick process-level status before hitting the router tree.
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount the versioned API routes after the shared middleware.
app.use('/api/auth', authRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/charging', chargingRoutes);
app.use('/api/cafe', cafeRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/vehicles', fleetRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/showroom', showroomRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/dealership', dealershipRoutes);
app.use('/api/franchise', dealershipRoutes);
app.use(API_PREFIX, apiRoutes);

// Convert all unmatched requests into a centralized API error.
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
});

// Centralized error handling stays last so all controllers can delegate failures here.
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();

    await freePort(PORT).catch((error) => {
      console.warn(`[PORT] Could not auto-free ${PORT}: ${error.message}`);
    });

    let server;
    let activePort = PORT;

    try {
      server = await listenOnPort(activePort);
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.warn(`[PORT] ${activePort} still in use, retrying after cleanup...`);
        await freePort(activePort);

        try {
          server = await listenOnPort(activePort);
        } catch (retryError) {
          console.warn(`[PORT] Port ${activePort} still unavailable, switching to next free port.`);

          for (let fallbackPort = Number(PORT) + 1; fallbackPort <= Number(PORT) + 10; fallbackPort += 1) {
            try {
              await freePort(fallbackPort).catch(() => {});
              server = await listenOnPort(fallbackPort);
              activePort = fallbackPort;
              break;
            } catch (fallbackError) {
              if (fallbackPort === Number(PORT) + 10) {
                throw fallbackError;
              }
            }
          }
        }
      } else {
        throw error;
      }
    }

    if (!server) {
      throw new Error(`Unable to start server on port ${PORT}`);
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🚀 EV CHARGING BACKEND STARTED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📌 MongoDB connected`);
    console.log(`📌 Server running on port ${activePort}`);
    console.log(`📌 Server URL: http://localhost:${activePort}`);
    console.log(`📌 Socket.IO endpoint: ws://localhost:${activePort}`);
    console.log(`📌 API Prefix: ${API_PREFIX}`);
    console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📌 MongoDB URI: ${process.env.MONGODB_URI || 'not configured'}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    const shutdown = async (signal) => {
      console.log(`${signal} received: closing server`);
      server.close(async () => {
        await closeDB();
        console.log('HTTP server and MongoDB connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`[SERVER] Port ${activePort} is already in use.`);
        return;
      }

      console.error('[SERVER] Failed to start HTTP listener:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
