const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
const verifyToken = (token) => jwt.verify(token, jwtSecret);

module.exports = { signToken, verifyToken };
