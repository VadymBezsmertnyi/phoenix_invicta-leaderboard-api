import z from "zod";

export const scoreSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  value: z.number(),
  created_at: z.string().or(z.date()),
});

export const scoresSchema = z.array(scoreSchema);

export const createScoreBodySchema = z.object({
  user_id: z.number().int().positive(),
  value: z.number().int().positive(),
});
