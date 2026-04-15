import z from "zod";
import { scoreSchema } from "./scores.schemas";

export type ScoreT = z.infer<typeof scoreSchema>;
