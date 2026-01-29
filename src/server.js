const http = require("http");
const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 3030;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
});
