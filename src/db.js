import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('animal_adoption', 'postgres', 'Cocolino1.', {
  host: 'localhost',
  dialect: 'postgres',
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

export default sequelize; 