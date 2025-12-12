import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    capturingUserId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'reviews',
    timestamps: true
  }
);

export default Review;
