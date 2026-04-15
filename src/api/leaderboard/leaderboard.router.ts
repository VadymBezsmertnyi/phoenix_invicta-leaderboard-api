import { Request, Response, Router } from "express";
import { ZodError } from "zod";

// types
import { LeaderboardT } from "./leaderboard.types";

// services
import { getLeaderboard } from "./leaderboard.service";

export const leaderboardRouter = Router();

leaderboardRouter.get(
  "/",
  async (_req: Request, res: Response<LeaderboardT | { message: string }>) => {
    try {
      const leaderboard = await getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? "Invalid response data";
        res.status(400).json({ message });
        return;
      }

      console.error("Failed to get leaderboard:", error);
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  }
);
