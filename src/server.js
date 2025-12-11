import dotenv from "dotenv";
dotenv.config();

import sequelize from "./config/database.js";
import { app } from "./app.js";

const PORT = parseInt(process.env.PORT || "8080", 10);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL");

    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down...");
      await sequelize.close();
      server.close(() => process.exit(0));
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Failed to connect to MySQL:", err);
    process.exit(1);
  }
}

start();
