import z from "zod";
import { createScoreBodySchema, scoreSchema } from "./scores.schemas";

export type ScoreT = z.infer<typeof scoreSchema>;
export type CreateScoreBodyT = z.infer<typeof createScoreBodySchema>;
