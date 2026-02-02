import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import { routes } from './routes';

// Load environment variables
dotenv.config();

// Validate critical environment variables
const validateEnv = () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = process.env.PORT || 3001;
  const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

  // Validate PORT
  const port = Number(PORT);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${PORT}. Must be a number between 1-65535.`);
  }

  // Validate CORS_ORIGIN format
  try {
    new URL(CORS_ORIGIN);
  } catch {
    throw new Error(`Invalid CORS_ORIGIN: ${CORS_ORIGIN}. Must be a valid URL.`);
  }

  // Warn if production without HTTPS
  if (NODE_ENV === 'production' && !CORS_ORIGIN.startsWith('https://')) {
    logger.warn('WARNING: CORS_ORIGIN should use HTTPS in production');
  }

  return { NODE_ENV, PORT: port, CORS_ORIGIN };
};

const env = validateEnv();

const app = express();

// Security: Helmet - sets various HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for development
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

// Security: HTTP Parameter Pollution protection
app.use(hpp());

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
    });
  },
});

app.use('/api/', limiter);

// CORS Configuration with validation
const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400, // 24 hours
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  logger.info(`Kong Suite Backend listening on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

  if (env.NODE_ENV === 'development') {
    logger.info('Security: Development mode - relaxed rate limits');
  } else {
    logger.info('Security: Production mode - strict rate limits and HTTPS enforced');
  }
});
