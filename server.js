import express from 'express';
import cors from 'cors';
import sequelize from './src/db.js';
import AnimalRouter from './src/routes/animals.js';
import ShelterRouter from './src/routes/shelters.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Detailed request logging
app.use((req, res, next) => {
  console.log('----------------------------------------');
  console.log('New Request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('----------------------------------------');
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Test endpoint is working!' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Routes without authentication
app.use('/api/animals', AnimalRouter);
app.use('/api/shelters', ShelterRouter);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit!');
  res.status(200).json({ status: 'ok' });
});

// Root endpoint with more information
app.get('/', (req, res) => {
  console.log('Root endpoint hit!');
  res.json({
    message: 'Animal Adoption API running',
    endpoints: {
      test: '/test',
      health: '/health',
      animals: '/api/animals',
      shelters: '/api/shelters',
      auth: '/api/auth'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: ['/', '/test', '/health', '/api/animals', '/api/shelters', '/api/auth']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Available endpoints:`);
    console.log(`- GET /test`);
    console.log(`- GET /health`);
    console.log(`- GET /api/animals`);
    console.log(`- GET /api/shelters`);
    console.log(`- POST /api/auth/register`);
  });
}); 