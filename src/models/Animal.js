import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Shelter from './Shelter.js';

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shelterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'shelterId',
    references: {
      model: 'Shelters',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
  underscored: true, 
});

export default Animal;