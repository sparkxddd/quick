const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient } = require('../server');

// -- Configuration --
const RATE_LIMITS = {
    common: {
        points: 20, // 20 requests
        duration: 60, // per 60 seconds
        blockDuration: 60 * 5, // Block for 5 minutes if consumed
    },
    auth: {
        points: 5, // 5 attempts
        duration: 60 * 15, // per 15 minutes
        blockDuration: 60 * 60, // Block for 1 hour
    },
    sensitive: {
        points: 3,
        duration: 60,
        blockDuration: 60 * 30, // 30 mins
    }
};

const limiters = {
    common: new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl_common',
        ...RATE_LIMITS.common,
    }),
    auth: new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl_auth',
        ...RATE_LIMITS.auth,
    }),
    sensitive: new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl_sensitive',
        ...RATE_LIMITS.sensitive,
    }),
};

/**
 * Rate Limiter Middleware
 * @param {'common' | 'auth' | 'sensitive'} type
 */
const rateLimiter = (type = 'common') => (req, res, next) => {
    const limiter = limiters[type] || limiters.common;

    // Identify user: User ID (if auth) or IP + User Agent (if anon)
    // Ensure we rely on a trusted source for userID (req.user set by auth middleware)
    const key = req.user ? req.user.id : `${req.ip}_${req.headers['user-agent'] || 'unknown'}`;

    limiter.consume(key)
        .then(() => {
            next();
        })
        .catch((rejRes) => {
            res.status(429).json({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 60,
            });
        });
};

module.exports = rateLimiter;
