import z from "zod";
import { createUserBodySchema, userSchema } from "./users.schemas";

export type UserT = z.infer<typeof userSchema>;
export type CreateUserBodyT = z.infer<typeof createUserBodySchema>;
