import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
        onDelete: "CASCADE",
      });

    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "user must have a email" },
          notEmpty: { msg: "email must not be empty" },
          isEmail: { msg: "must be a valid email" },
        },
      },
      password_hash: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "USER",
      },
    },
    {
      tableName: "users",
      sequelize,
      modelName: "User",
      id: false,
    },
  );
  return User;
};
