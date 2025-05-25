import express from 'express';
import cors from 'cors';
import sequelize from './src/db.js';
import AnimalRouter from './src/routes/animals.js';
import ShelterRouter from './src/routes/shelters.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { authenticateToken } from './src/middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['https://whiskers-wonderland.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/animals', authenticateToken, AnimalRouter);
app.use('/api/shelters', authenticateToken, ShelterRouter);

// Admin routes
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Root endpoint
app.get('/', (req, res) => res.send('Animal Adoption API running'));

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
  });
}); 