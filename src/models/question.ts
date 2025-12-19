import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface QuestionAttributes {
  id: number;
  questionText: string;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> {}

class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  declare id: number;
  declare questionText: string;
  declare categoryId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Changed to allow null for easier seeding
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'questions',
    timestamps: true
  }
);

export default Question;
