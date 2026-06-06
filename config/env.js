/**
 * Backend Environment Configuration
 * Handles all environment variables for the Express backend
 * Supports local development and production deployments
 */

require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5001', 10),
    env: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api',
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: (process.env.NODE_ENV || 'development') === 'production',
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/energeia-dev',
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE || '20', 10),
    minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE || '2', 10),
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    retryCount: process.env.MONGO_RETRY_COUNT ? parseInt(process.env.MONGO_RETRY_COUNT, 10) : 5,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((url) => url.trim())
      : ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:19007', 'exp://localhost'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiration: process.env.JWT_EXPIRATION || '7d',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },

  // File Upload Configuration
  upload: {
    directory: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB default
    allowedMimes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
  },

  // Email Configuration
  email: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpUser: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASSWORD || '',
    smtpFrom: process.env.SMTP_FROM || 'noreply@energeia.com',
    enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
  },

  // Stripe Configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    enabled: !!process.env.STRIPE_SECRET_KEY,
  },

  // Feature Flags
  features: {
    debugLogs: process.env.ENABLE_DEBUG_LOGS === 'true',
    mockData: process.env.ENABLE_MOCK_DATA === 'true',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    enabled: process.env.NODE_ENV === 'production',
  },

  // Request/Response Configuration
  json: {
    limit: process.env.JSON_LIMIT || '1mb',
  },
};

/**
 * Validate that all required environment variables are set
 * Fails fast in production if critical config is missing
 */
const validateConfig = () => {
  const errors = [];

  if (!config.database.uri) {
    errors.push('MONGODB_URI is not configured');
  }

  if (config.server.isProduction) {
    if (!config.jwt.secret || config.jwt.secret === 'change-this-secret-in-production') {
      errors.push('JWT_SECRET must be set in production');
    }

    if (!process.env.CORS_ORIGIN) {
      errors.push('CORS_ORIGIN must be set in production');
    }

    if (!config.database.uri.startsWith('mongodb+srv://') && !config.database.uri.startsWith('mongodb://')) {
      errors.push('Invalid MONGODB_URI format');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration Validation Failed:');
    errors.forEach((error) => console.error(`   - ${error}`));

    if (config.server.isProduction) {
      throw new Error('Critical configuration missing. See errors above.');
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Log safe configuration (never logs sensitive data)
 */
const logConfiguration = () => {
  if (config.features.debugLogs) {
    console.log('\n[Config] Backend Configuration:');
    console.log('  Server:', {
      port: config.server.port,
      env: config.server.env,
    });
    console.log('  Database:', {
      uri: config.database.uri.replace(/:[^:@]+@/, ':***@'), // Hide password
      poolSize: `${config.database.minPoolSize}-${config.database.maxPoolSize}`,
    });
    console.log('  CORS Origins:', config.cors.origin);
    console.log('  Upload:', {
      directory: config.upload.directory,
      maxFileSize: `${(config.upload.maxFileSize / 1024 / 1024).toFixed(2)}MB`,
    });
    console.log('  Email:', {
      enabled: config.email.enabled,
      from: config.email.smtpFrom,
    });
    console.log('  Stripe:', {
      enabled: config.stripe.enabled,
    });
    console.log('');
  }
};

// Validate on module load
validateConfig();

// Log configuration if debug logs are enabled
if (config.features.debugLogs) {
  logConfiguration();
}

module.exports = config;
