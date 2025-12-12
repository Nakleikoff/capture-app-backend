import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { answers } from '../enums/answers.enum.js';

const Answer = sequelize.define(
  'Answer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    answer: {
      type: DataTypes.INTEGER,
      allowNull: false,

      get() {
        const rawValue = this.getDataValue('answer');

        const answerValue = Object.keys(answers).find(key => answers[key] === rawValue);
        return answerValue || 'UNKNOWN';
      },

      set(value) {
        if (answers[value]) {
          this.setDataValue('answer', answers[value]);
        } else {
          throw new Error('Invalid answer value');
        }
      }
    },
    commentText: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'answers',
    timestamps: true
  }
);

export default Answer;
