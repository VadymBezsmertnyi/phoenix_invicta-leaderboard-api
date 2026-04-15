// config
import { dbPool } from "../../config/db";

// schemas
import { leaderboardSchema } from "./leaderboard.schemas";

// types
import { LeaderboardItemT, LeaderboardT } from "./leaderboard.types";

type LeaderboardRowT = Omit<LeaderboardItemT, "rank">;

export const getLeaderboard = async (): Promise<LeaderboardT> => {
  const rows = await dbPool.query(
    `SELECT users.username,
            SUM(scores.value) AS total_score,
            AVG(scores.value) AS average_score,
            MAX(scores.created_at) AS last_activity
     FROM users
     INNER JOIN scores ON scores.user_id = users.id
     GROUP BY users.id, users.username
     ORDER BY total_score DESC
     LIMIT 100`
  );

  const rankedRows = (rows as LeaderboardRowT[]).map((row, index) => ({
    rank: index + 1,
    username: row.username,
    total_score: Number(row.total_score),
    average_score: Number(row.average_score),
    last_activity: String(row.last_activity),
  }));

  const validatedLeaderboard = leaderboardSchema.parse(rankedRows);
  return validatedLeaderboard;
};
