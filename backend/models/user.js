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
        defaultValue: () => uuidv4(),
      },
    },
    {
      tableName: "users",
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
