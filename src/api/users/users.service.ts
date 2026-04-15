import { dbPool } from "../../config/db";

// schemas
import {
  createUserBodySchema,
  userRankSchema,
  userSchema,
  usersSchema,
} from "./users.schemas";

// types
import { UserRankT, UserT } from "./users.types";

export const getUsers = async (): Promise<UserT[]> => {
  const rows = await dbPool.query(
    "SELECT id, username, created_at FROM users ORDER BY id DESC"
  );
  const validatedUsers = usersSchema.parse(rows);

  return validatedUsers;
};

export const createUser = async (input: unknown): Promise<UserT> => {
  const validatedInput = createUserBodySchema.parse(input);
  const insertResult = await dbPool.query(
    "INSERT INTO users (username) VALUES (?)",
    [validatedInput.username]
  );
  const insertId = (insertResult as { insertId: number }).insertId;
  const rows = await dbPool.query(
    "SELECT id, username, created_at FROM users WHERE id = ? LIMIT 1",
    [insertId]
  );
  if (rows.length === 0) throw new Error("Created user was not found");

  const user = rows[0];
  if (!user) throw new Error("Created user was not found");

  const validatedUser = userSchema.parse(user);
  return validatedUser;
};

export const getUserRank = async (userId: number): Promise<UserRankT> => {
  const userRows = await dbPool.query(
    "SELECT id, username FROM users WHERE id = ? LIMIT 1",
    [userId]
  );
  if (userRows.length === 0) throw new Error("User not found");

  const user = userRows[0] as { id: number; username: string } | undefined;
  if (!user) throw new Error("User not found");

  const totalRows = await dbPool.query(
    "SELECT SUM(value) AS total_score FROM scores WHERE user_id = ?",
    [userId]
  );
  const totalScoreRow = totalRows[0] as
    | { total_score: number | null }
    | undefined;
  const totalScore = Number(totalScoreRow?.total_score ?? 0);
  const rankRows = await dbPool.query(
    `SELECT COUNT(*) + 1 AS rank
     FROM (
       SELECT user_id, SUM(value) AS total
       FROM scores
       GROUP BY user_id
     ) t
     WHERE total > ?`,
    [totalScore]
  );
  const rankRow = rankRows[0] as { rank: number } | undefined;
  const result = {
    user_id: user.id,
    username: user.username,
    rank: Number(rankRow?.rank ?? 1),
    total_score: totalScore,
  };
  const validatedResult = userRankSchema.parse(result);
  return validatedResult;
};
