import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface TeammateAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TeammateCreationAttributes extends Optional<TeammateAttributes, 'id'> {}

class Teammate extends Model<TeammateAttributes, TeammateCreationAttributes> implements TeammateAttributes {
  declare id: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Teammate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'teammates',
    timestamps: true
  }
);

export default Teammate;
