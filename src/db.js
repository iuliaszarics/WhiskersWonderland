import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

console.log('Database URL:', dbUrl ? 'URL is set' : 'URL is not set');
console.log('Environment:', process.env.NODE_ENV || 'development');

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: (msg) => console.log('Sequelize:', msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Test if tables exist
    const tables = await sequelize.showAllSchemas();
    console.log('Available tables:', tables);
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (error.original) {
      console.error('Original error:', error.original);
    }
    if (error.parent) {
      console.error('Parent error:', error.parent);
    }
    // Log the full error stack
    console.error('Full error stack:', error.stack);
  }
}

testConnection();

export default sequelize; 