import mariadb from "mariadb";
import { env } from "./env";

export const dbPool = mariadb.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: 5,
});

export const checkDbConnection = async (): Promise<void> => {
  let connection: mariadb.PoolConnection | undefined;

  try {
    connection = await dbPool.getConnection();
    await connection.query("SELECT 1");
  } finally {
    connection?.release();
  }
};
