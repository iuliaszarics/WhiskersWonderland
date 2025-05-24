
import sequelize from './db.js';

sequelize.sync({ force: true })  
  .then(() => {
    console.log('Database synced!');
  })
  .catch((err) => {
    console.log('Error syncing database:', err);
  });
