// 'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "author",
        onDelete: "CASCADE",
      });
    }
  }
  Post.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "userId",
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      content: DataTypes.TEXT,
      images: DataTypes.JSON,
      likesCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "posts",
      modelName: "Post",
      id: false,
    },
  );
  return Post;
};
