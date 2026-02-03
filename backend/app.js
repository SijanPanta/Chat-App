import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS for Next.js frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api", routes);

export default app;
