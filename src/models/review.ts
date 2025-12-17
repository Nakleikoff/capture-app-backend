import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface ReviewAttributes {
  id: number;
  capturingUserId: string;
  period: string;
  teammateId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  declare id: number;
  declare capturingUserId: string;
  declare period: string;
  declare teammateId?: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Review.init(
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
    },
    teammateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'teammates',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: true
  }
);

export default Review;
