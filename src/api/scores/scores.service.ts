import { dbPool } from "../../config/db";

// schemas
import {
  createScoreBodySchema,
  scoreSchema,
  scoresSchema,
} from "./scores.schemas";

// types
import { CreateScoreBodyT, ScoreT } from "./scores.types";

export const getScores = async (): Promise<ScoreT[]> => {
  const rows = await dbPool.query(
    "SELECT id, user_id AS userId, value, created_at FROM scores ORDER BY id DESC"
  );
  const validatedScores = scoresSchema.parse(rows);

  return validatedScores;
};

export const addScore = async (
  input: unknown | CreateScoreBodyT
): Promise<ScoreT> => {
  const validatedInput = createScoreBodySchema.parse(input);
  const users = await dbPool.query(
    "SELECT id FROM users WHERE id = ? LIMIT 1",
    [validatedInput.userId]
  );
  if (users.length === 0) throw new Error("User not found");

  const insertResult = await dbPool.query(
    "INSERT INTO scores (user_id, value) VALUES (?, ?)",
    [validatedInput.userId, validatedInput.value]
  );
  const insertId = (insertResult as { insertId: number }).insertId;
  const rows = await dbPool.query(
    "SELECT id, user_id AS userId, value, created_at FROM scores WHERE id = ? LIMIT 1",
    [insertId]
  );
  if (rows.length === 0) throw new Error("Created score was not found");

  const score = rows[0];
  if (!score) throw new Error("Created score was not found");

  const validatedScore = scoreSchema.parse(score);

  return validatedScore;
};
