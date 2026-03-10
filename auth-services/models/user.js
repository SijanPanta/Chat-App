import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_hash: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: "USER",
      },
    },
    {
      tableName: "users",   // ← same table name as main app
      sequelize,
      modelName: "User",
      id: false,
    }
  );

  return User;
};
