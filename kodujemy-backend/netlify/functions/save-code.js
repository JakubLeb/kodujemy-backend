const { ensureSchema, sql } = require('./utils/db');
const { json, preflight, parseBody, getUserFromAuth } = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metoda niedozwolona' });

  try {
    await ensureSchema();
    const user = await getUserFromAuth(event);
    if (!user) return json(401, { error: 'Niezalogowany.' });

    const { taskId, code } = parseBody(event);
    if (!taskId) return json(400, { error: 'Brak taskId.' });

    const safeCode = typeof code === 'string' ? code : '';

    await sql`
      INSERT INTO saved_codes (user_id, task_id, code, updated_at)
      VALUES (${user.id}, ${taskId}, ${safeCode}, now())
      ON CONFLICT (user_id, task_id)
      DO UPDATE SET code = ${safeCode}, updated_at = now()`;

    return json(200, { ok: true });
  } catch (e) {
    console.error('save-code error:', e);
    return json(500, { error: 'Błąd serwera przy zapisie kodu.' });
  }
};
