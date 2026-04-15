import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`Leaderboard API is running on port ${env.PORT}`);
});

server.on("error", (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
