import sequelize from '../db.js';
import Animal from './Animal.js';
import Shelter from './Shelter.js';
import User from './User.js';
import ActivityLog from './ActivityLog.js';

User.hasMany(ActivityLog, { foreignKey: 'userId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

Animal.belongsTo(Shelter, { foreignKey: 'shelterId' });
Shelter.hasMany(Animal, { foreignKey: 'shelterId' });

export { Animal, Shelter };