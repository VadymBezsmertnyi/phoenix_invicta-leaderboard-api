import { Request, Response, Router } from "express";
import { z, ZodError } from "zod";

// types
import { UserRankT, UserT } from "./users.types";

// services
import { createUser, getUserRank, getUsers } from "./users.service";

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

usersRouter.get(
  "/:id/rank",
  async (
    req: Request<{ id: string }, UserRankT | { message: string }>,
    res: Response<UserRankT | { message: string }>
  ) => {
    try {
      const userId = z.number().int().positive().parse(Number(req.params.id));
      const userRank = await getUserRank(userId);
      res.json(userRank);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? "Invalid request params";
        res.status(400).json({ message });
        return;
      }
      if (error instanceof Error && error.message === "User not found") {
        res.status(404).json({ message: "User not found" });
        return;
      }

      console.error("Failed to get user rank:", error);
      res.status(500).json({ message: "Failed to get user rank" });
    }
  }
);
