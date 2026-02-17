import { Model } from "sequelize";
import { union } from "zod";

export default (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Like.belongsTo(models.User,{foreignKey:'userId'})
      Like.belongsTo(models.Post,{foreignKey:'postId'})
    }
  }
  Like.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Like",
      indexes: [{ unique: true, fields: ["userId", "postId"] }],
    },
  );
  return Like;
};
