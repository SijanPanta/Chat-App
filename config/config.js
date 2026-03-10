import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: resolve(__rootDir, ".env") });

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3307,
  },
};
