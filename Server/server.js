require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { testConnection } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const videoRoutes = require('./routes/videoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// ----- Global middleware -----
const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',').map((origin) => origin.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin === 'http://localhost:5173') {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Health check -----
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MERN Course Management System API is running',
  });
});

// ----- Routes -----
app.use('/auth', authRoutes);
app.use('/course', courseRoutes);
app.use('/video', videoRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/api/ai', aiRoutes);

// ----- 404 + centralized error handling (must be last) -----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database. Server not started.');
    console.error(err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
