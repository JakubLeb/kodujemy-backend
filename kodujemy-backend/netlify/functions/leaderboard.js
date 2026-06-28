const { ensureSchema, sql } = require('./utils/db');
const { json, preflight, getUserFromAuth } = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;

  try {
    await ensureSchema();

    const limitRaw = parseInt(
      (event.queryStringParameters && event.queryStringParameters.limit) || '10',
      10
    );
    const limit = Math.max(1, Math.min(100, limitRaw || 10));

    const top = await sql`
      WITH ranked AS (
        SELECT
          u.id,
          u.name,
          u.xp,
          COUNT(st.task_id)::int AS solved_count,
          ROW_NUMBER() OVER (ORDER BY u.xp DESC, u.created_at ASC) AS rank
        FROM users u
        LEFT JOIN solved_tasks st ON st.user_id = u.id
        GROUP BY u.id
      )
      SELECT id, name, xp, solved_count, rank
      FROM ranked
      ORDER BY rank
      LIMIT ${limit}`;

    const leaderboard = top.map((r) => ({
      id: r.id,
      name: r.name,
      xp: r.xp,
      solvedCount: r.solved_count,
      rank: Number(r.rank),
    }));

    const result = { leaderboard };

    const user = await getUserFromAuth(event);
    if (user) {
      const inTop = leaderboard.some((p) => p.id === user.id);
      if (!inTop) {
        const meRows = await sql`
          WITH ranked AS (
            SELECT
              u.id, u.name, u.xp,
              ROW_NUMBER() OVER (ORDER BY u.xp DESC, u.created_at ASC) AS rank
            FROM users u
          )
          SELECT id, name, xp, rank FROM ranked WHERE id = ${user.id} LIMIT 1`;
        if (meRows[0]) {
          result.me = {
            id: meRows[0].id,
            name: meRows[0].name,
            xp: meRows[0].xp,
            rank: Number(meRows[0].rank),
          };
        }
      }
    }

    return json(200, result);
  } catch (e) {
    console.error('leaderboard error:', e);
    return json(500, { error: 'Błąd serwera przy ładowaniu rankingu.' });
  }
};
