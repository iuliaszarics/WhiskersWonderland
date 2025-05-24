import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Animal from './Animal.js';

const Shelter = sequelize.define('Shelter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_info: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Shelters',
  timestamps: true,
  underscored: true,
});

export default Shelter;