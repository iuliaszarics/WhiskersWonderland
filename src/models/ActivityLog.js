import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER
  },
  details: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

export default ActivityLog;