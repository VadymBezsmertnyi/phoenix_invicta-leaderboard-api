import { dbPool } from "../../config/db";
import { UserT } from "./users.types";

export const getUsers = async (): Promise<UserT[]> => {
  const rows = await dbPool.query(
    "SELECT id, username, created_at FROM users ORDER BY id DESC",
  );

  return rows as UserT[];
};

export const createUser = async (username: string): Promise<UserT> => {
  const insertResult = await dbPool.query(
    "INSERT INTO users (username) VALUES (?)",
    [username],
  );

  const insertId = (insertResult as { insertId: number }).insertId;
  const rows = await dbPool.query(
    "SELECT id, username, created_at FROM users WHERE id = ? LIMIT 1",
    [insertId],
  );

  const user = (rows as UserT[])[0];

  if (!user) {
    throw new Error("Failed to fetch created user");
  }

  return user;
};
