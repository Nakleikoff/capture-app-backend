import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

interface CategoryAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  declare id: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Category.init(
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
    tableName: 'categories',
    timestamps: true
  }
);

export default Category;
