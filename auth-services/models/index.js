import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import path from "path";
import configFile from "../../config/config.js";  // ← shared config
import defineUser from "./user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  { ...config, logging: false }
);

const db = {};
db.User = defineUser(sequelize, Sequelize.DataTypes);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
