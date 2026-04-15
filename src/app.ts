import express from "express";
import { scoresRouter } from "./api/scores/scores.router";
import { usersRouter } from "./api/users/users.router";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/scores", scoresRouter);
app.use("/api/users", usersRouter);
