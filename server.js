import express from 'express';
import cors from 'cors';
import sequelize from './src/db.js';
import AnimalRouter from './src/routes/animals.js';
import ShelterRouter from './src/routes/shelters.js';
import authRoutes from './src/routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/animals', AnimalRouter);
app.use('/shelters', ShelterRouter);

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Root endpoint
app.get('/', (req, res) => res.send('Animal Adoption API running'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}); 