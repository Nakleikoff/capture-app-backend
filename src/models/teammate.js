import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Teammate = sequelize.define(
  'Teammate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'teammates',
    timestamps: true,
  },
);

export default Teammate;
