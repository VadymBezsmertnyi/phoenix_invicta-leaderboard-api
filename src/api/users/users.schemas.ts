import z from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  created_at: z.string(),
});

export const createUserBodySchema = z.object({
  username: z.string().trim().min(3).max(100),
});
