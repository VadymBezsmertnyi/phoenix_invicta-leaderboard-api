import z from "zod";
import { userSchema } from "./users.schemas";

export type UserT = z.infer<typeof userSchema>;
