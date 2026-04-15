import z from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  created_at: z.string().or(z.date()),
});

export const usersSchema = z.array(userSchema);

export const createUserBodySchema = z.object({
  username: z.string().trim().min(3).max(100),
});

export const userRankSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  rank: z.number(),
  total_score: z.number(),
});
