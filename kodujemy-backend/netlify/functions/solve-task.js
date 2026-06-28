const { ensureSchema, sql } = require('./utils/db');
const {
  json, preflight, parseBody, getUserFromAuth, activityRowToItem,
} = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metoda niedozwolona' });

  try {
    await ensureSchema();
    const user = await getUserFromAuth(event);
    if (!user) return json(401, { error: 'Niezalogowany.' });

    const { taskId, title, category, xp } = parseBody(event);
    if (!taskId) return json(400, { error: 'Brak taskId.' });

    const xpAward = Math.max(0, Math.min(1000, parseInt(xp, 10) || 0));

    const ins = await sql`
      INSERT INTO solved_tasks (user_id, task_id)
      VALUES (${user.id}, ${taskId})
      ON CONFLICT (user_id, task_id) DO NOTHING
      RETURNING task_id`;

    if (ins.length === 0) {
      return json(200, { alreadySolved: true });
    }

    const upd = await sql`
      UPDATE users SET xp = xp + ${xpAward} WHERE id = ${user.id}
      RETURNING xp`;
    const newXp = upd[0].xp;

    const subtitle = category ? `Zadanie • ${category}` : 'Zadanie rozwiązane';
    const actRows = await sql`
      INSERT INTO activity (user_id, icon, title, subtitle, xp, task_id)
      VALUES (${user.id}, 'Py', ${title || 'Rozwiązano zadanie'}, ${subtitle}, ${xpAward}, ${taskId})
      RETURNING icon, title, subtitle, xp, task_id, created_at`;

    return json(200, { newXp, activityItem: activityRowToItem(actRows[0]) });
  } catch (e) {
    console.error('solve-task error:', e);
    return json(500, { error: 'Błąd serwera przy zapisie zadania.' });
  }
};
