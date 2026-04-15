import { dbPool } from "../config/db";

const seed = async (): Promise<void> => {
  let connection;

  try {
    connection = await dbPool.getConnection();
    await connection.query("DELETE FROM scores");
    await connection.query("DELETE FROM users");

    const users = await connection.query(
      "INSERT INTO users (username) VALUES (?), (?), (?) RETURNING id, username",
      ["alice", "bob", "charlie"]
    );

    const insertedUsers = users as Array<{ id: number; username: string }>;
    const alice = insertedUsers[0];
    const bob = insertedUsers[1];
    const charlie = insertedUsers[2];

    if (!alice || !bob || !charlie) {
      throw new Error("Cannot create seed scores without seeded users");
    }

    await connection.query(
      "INSERT INTO scores (user_id, value) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)",
      [alice.id, 100, bob.id, 120, charlie.id, 90, alice.id, 80, bob.id, 40]
    );

    console.log("Seed completed");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    connection?.release();
    await dbPool.end();
  }
};

void seed();
