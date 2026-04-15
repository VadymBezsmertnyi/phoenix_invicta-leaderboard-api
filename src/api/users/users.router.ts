import { Router } from "express";
import { createUser, getUsers } from "./users.service";

export const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error("Failed to get users:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
});

usersRouter.post("/", async (req, res) => {
  const { username } = req.body as { username?: string };

  if (!username) {
    res.status(400).json({ message: "username is required" });
    return;
  }

  try {
    const user = await createUser(username);
    res.status(201).json(user);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});
