import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { answers } from '../enums/answers.enum.js';

interface AnswerAttributes {
  id: number;
  answer: number;
  commentText: string;
  reviewId?: number;
  questionId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type AnswerCreationAttributes = Optional<AnswerAttributes, 'id'>;

class Answer
  extends Model<AnswerAttributes, AnswerCreationAttributes>
  implements AnswerAttributes
{
  declare id: number;
  declare answer: number;
  declare commentText: string;
  declare reviewId?: number;
  declare questionId?: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Answer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    answer: {
      type: DataTypes.INTEGER,
      allowNull: false,

      get(this: Answer): number {
        const rawValue = this.getDataValue('answer');
        return rawValue;
      },

      set(this: Answer, value: number | string): void {
        if (typeof value === 'number') {
          if ([1, -1, 0].includes(value)) {
            this.setDataValue('answer', value);
          } else {
            throw new Error('Invalid answer value. Must be 1, -1, or 0');
          }
        } else if (
          typeof value === 'string' &&
          answers[value as keyof typeof answers]
        ) {
          this.setDataValue('answer', answers[value as keyof typeof answers]);
        } else {
          throw new Error('Invalid answer value');
        }
      },
    },
    commentText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'reviews',
        key: 'id',
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'questions',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'answers',
    timestamps: true,
  },
);

export default Answer;
