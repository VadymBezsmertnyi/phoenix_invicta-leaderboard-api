import z from "zod";
import {
  createUserBodySchema,
  userRankSchema,
  userSchema,
} from "./users.schemas";

export type UserT = z.infer<typeof userSchema>;
export type CreateUserBodyT = z.infer<typeof createUserBodySchema>;
export type UserRankT = z.infer<typeof userRankSchema>;
