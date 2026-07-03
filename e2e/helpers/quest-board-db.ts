import { Pool } from "pg";

export async function withPool<T>(fn: (pool: Pool) => Promise<T>): Promise<T> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  try {
    return await fn(pool);
  } finally {
    await pool.end();
  }
}

function yesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split("T")[0];
}

export async function setBoardToYesterday(
  familyGroupId: string,
): Promise<string> {
  return withPool(async (pool) => {
    const boardRes = await pool.query(
      `SELECT id FROM quest_boards
       WHERE family_group_id = $1 AND status = 'active'`,
      [familyGroupId],
    );
    if (boardRes.rows.length === 0) {
      throw new Error(`No active board found for family ${familyGroupId}`);
    }
    const boardId = boardRes.rows[0].id;
    const yesterday = yesterdayUTC();

    await pool.query(
      `UPDATE quest_boards SET created_app_date = $1, manual_refresh_date = NULL WHERE id = $2`,
      [yesterday, boardId],
    );
    await pool.query(
      `UPDATE quest_progress SET assigned_date = $1 WHERE quest_board_id = $2`,
      [yesterday, boardId],
    );

    return boardId;
  });
}

export async function getFamilyGroupId(email: string): Promise<string> {
  return withPool(async (pool) => {
    const res = await pool.query(
      `SELECT fm.family_group_id FROM family_members fm
       INNER JOIN "user" u ON fm.user_id = u.id
       WHERE u.email = $1`,
      [email],
    );
    if (res.rows.length === 0) {
      throw new Error(`Family not found for email ${email}`);
    }
    return res.rows[0].family_group_id;
  });
}

export async function setManualRefreshToYesterday(
  familyGroupId: string,
): Promise<string> {
  return withPool(async (pool) => {
    const boardRes = await pool.query(
      `SELECT id FROM quest_boards
       WHERE family_group_id = $1 AND status = 'active'`,
      [familyGroupId],
    );
    if (boardRes.rows.length === 0) {
      throw new Error(`No active board found for family ${familyGroupId}`);
    }
    const boardId = boardRes.rows[0].id;
    const yesterday = yesterdayUTC();

    await pool.query(
      `UPDATE quest_boards SET manual_refresh_date = $1 WHERE id = $2`,
      [yesterday, boardId],
    );

    return boardId;
  });
}
