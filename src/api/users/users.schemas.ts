import z from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  created_at: z.string(),
});
