import { dbPool } from "../../config/db";

// schemas
import { createUserBodySchema, userSchema, usersSchema } from "./users.schemas";

// types
import { CreateUserBodyT, UserT } from "./users.types";

export const getUsers = async (): Promise<UserT[]> => {
  const rows = await dbPool.query(
    "SELECT id, username, created_at FROM users ORDER BY id DESC"
  );
  const validatedUsers = usersSchema.parse(rows);

  return validatedUsers;
};

export const createUser = async (
  input: unknown | CreateUserBodyT
): Promise<UserT> => {
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
