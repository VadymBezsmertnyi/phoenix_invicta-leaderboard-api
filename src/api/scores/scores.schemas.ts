import z from "zod";

export const scoreSchema = z.object({
  id: z.number(),
  userId: z.number(),
  value: z.number(),
  created_at: z.string(),
});
