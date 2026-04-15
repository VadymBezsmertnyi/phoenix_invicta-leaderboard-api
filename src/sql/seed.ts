import type { PoolConnection } from "mariadb";
import { dbPool } from "../config/db";

// constants
import { IS_DEVELOPMENT } from "../config/env";

const USERS_COUNT = 100_000;
const SCORES_COUNT = 500_000;
const USERS_BATCH_SIZE = 5_000;
const SCORES_BATCH_SIZE = 10_000;

const buildValuesClause = (
  rowsCount: number,
  columnsPerRow: number
): string => {
  const rowPlaceholder = `(${Array(columnsPerRow).fill("?").join(", ")})`;
  return Array(rowsCount).fill(rowPlaceholder).join(", ");
};

const seed = async (): Promise<void> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await dbPool.getConnection();
    if (IS_DEVELOPMENT) console.warn("Cleaning tables...");

    await connection.query("DELETE FROM scores");
    await connection.query("DELETE FROM users");
    await connection.query("ALTER TABLE users AUTO_INCREMENT = 1");
    await connection.query("ALTER TABLE scores AUTO_INCREMENT = 1");
    if (IS_DEVELOPMENT) console.warn(`Seeding users: ${USERS_COUNT}`);

    for (let start = 1; start <= USERS_COUNT; start += USERS_BATCH_SIZE) {
      const end = Math.min(start + USERS_BATCH_SIZE - 1, USERS_COUNT);
      const batchCount = end - start + 1;
      const valuesClause = buildValuesClause(batchCount, 1);
      const params: string[] = [];
      for (let i = start; i <= end; i += 1) {
        params.push(`user_${i}`);
      }

      await connection.query(
        `INSERT INTO users (username) VALUES ${valuesClause}`,
        params
      );
      if (IS_DEVELOPMENT && (end % 20_000 === 0 || end === USERS_COUNT))
        console.warn(`Users inserted: ${end}/${USERS_COUNT}`);
    }

    if (IS_DEVELOPMENT) console.warn(`Seeding scores: ${SCORES_COUNT}`);
    for (
      let inserted = 0;
      inserted < SCORES_COUNT;
      inserted += SCORES_BATCH_SIZE
    ) {
      const batchCount = Math.min(SCORES_BATCH_SIZE, SCORES_COUNT - inserted);
      const valuesClause = buildValuesClause(batchCount, 2);
      const params: number[] = [];
      for (let i = 0; i < batchCount; i += 1) {
        const userId = Math.floor(Math.random() * USERS_COUNT) + 1;
        const value = Math.floor(Math.random() * 1000) + 1;
        params.push(userId, value);
      }

      await connection.query(
        `INSERT INTO scores (user_id, value) VALUES ${valuesClause}`,
        params
      );

      const totalInserted = inserted + batchCount;
      if (
        IS_DEVELOPMENT &&
        (totalInserted % 100_000 === 0 || totalInserted === SCORES_COUNT)
      )
        console.warn(`Scores inserted: ${totalInserted}/${SCORES_COUNT}`);
    }

    if (IS_DEVELOPMENT) console.warn("Seed completed");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    connection?.release();
    await dbPool.end();
  }
};

void seed();
