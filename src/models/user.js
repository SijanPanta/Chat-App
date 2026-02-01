import { Model } from "sequelize";

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
    },
    {
      tableName: "users",
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
