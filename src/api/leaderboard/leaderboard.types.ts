import z from "zod";
import {
  leaderboardItemSchema,
  leaderboardSchema,
} from "./leaderboard.schemas";

export type LeaderboardItemT = z.infer<typeof leaderboardItemSchema>;
export type LeaderboardT = z.infer<typeof leaderboardSchema>;
