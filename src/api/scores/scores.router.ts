import { Request, Response, Router } from "express";
import { ZodError } from "zod";

// types
import { ScoreT } from "./scores.types";

// services
import { addScore, getScores } from "./scores.service";

export const scoresRouter = Router();

scoresRouter.get(
  "/",
  async (_req: Request, res: Response<ScoreT[] | { message: string }>) => {
    try {
      const scores = await getScores();
      res.json(scores);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? "Invalid request body";
        res.status(400).json({ message });
        return;
      }
      console.error("Failed to get scores:", error);
      res.status(500).json({ message: "Failed to get scores" });
    }
  }
);

scoresRouter.post(
  "/",
  async (
    req: Request<{}, ScoreT | { message: string }, unknown>,
    res: Response<ScoreT | { message: string }>
  ) => {
    try {
      const score = await addScore(req.body);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? "Invalid request body";
        res.status(400).json({ message });
        return;
      }
      if (error instanceof Error && error.message === "User not found") {
        res.status(404).json({ message: "User not found" });
        return;
      }

      console.error("Failed to create score:", error);
      res.status(500).json({ message: "Failed to create score" });
    }
  }
);
