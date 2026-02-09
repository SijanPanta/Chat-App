import "dotenv/config";
import http from "http";
import app from "./app.js";
import sequelize from "./config/db.js";
const PORT = process.env.PORT || 3030;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // Alter database schema to match models (safer - won't drop data)
    // await sequelize.sync({ alter: true });
    // console.log("Database schema updated successfully");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
});
