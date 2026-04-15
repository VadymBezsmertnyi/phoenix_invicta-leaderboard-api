import { Request, Response, Router } from "express";
import { ZodError } from "zod";

// types
import { UserT } from "./users.types";

// services
import { createUser, getUsers } from "./users.service";

export const usersRouter = Router();

usersRouter.get(
  "/",
  async (_req: Request, res: Response<UserT[] | { message: string }>) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? "Invalid request body";
        res.status(400).json({ message });
        return;
      }
      console.error("Failed to get users:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  }
);

usersRouter.post(
  "/",
  async (
    req: Request<{}, UserT | { message: string }, unknown>,
    res: Response<UserT | { message: string }>
  ) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? "Invalid request body";
        res.status(400).json({ message });
        return;
      }
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ER_DUP_ENTRY"
      ) {
        res.status(409).json({ message: "Username already exists" });
        return;
      }

      console.error("Failed to create user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  }
);
