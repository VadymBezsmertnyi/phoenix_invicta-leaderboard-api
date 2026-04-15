import z from "zod";

export const leaderboardItemSchema = z.object({
  rank: z.number(),
  username: z.string(),
  total_score: z.number(),
  average_score: z.number(),
  last_activity: z.string(),
});

export const leaderboardSchema = z.array(leaderboardItemSchema);
