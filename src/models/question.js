import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Question = sequelize.define(
  'Question',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'questions',
    timestamps: true
  }
);

export default Question;
