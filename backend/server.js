const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const Redis = require('ioredis');

// Initialize Redis Client
const redisClient = new Redis(env.REDIS_URL);

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('Redis connected');
});

const app = express();

// Security Middleware
app.use(helmet()); // Set secure HTTP headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // Body limit protection
app.use(cookieParser());
const secretGuard = require('./middleware/secretGuard');
app.use(secretGuard);

// Trust Proxy (Required if behind Nginx/Load Balancer)
app.enable('trust proxy');

// Rate Limiting (Global for unauthenticated API, specific for auth)
const rateLimiter = require('./middleware/rateLimiter');
// app.use(rateLimiter('common')); // Optional: Apply global limit to everything if desired, but we want granular

// Routes
const authRoutes = require('./routes/auth.routes');
const searchRoutes = require('./routes/search.routes');

app.use('/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
const server = app.listen(env.PORT, () => {
    console.log(`🚀 Backend secure server running on port ${env.PORT}`);
    console.log(`Running in ${env.NODE_ENV} mode`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        redisClient.quit();
    });
});

module.exports = { app, redisClient };
