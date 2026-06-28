// POST /api/save-playground  { code }  (Bearer)
// Zapisuje kod z playgrounda na koncie usera. Zwraca { ok: true }.
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

    const { code } = parseBody(event);
    const safeCode = typeof code === 'string' ? code : '';

    await sql`UPDATE users SET playground_code = ${safeCode} WHERE id = ${user.id}`;
    return json(200, { ok: true });
  } catch (e) {
    console.error('save-playground error:', e);
    return json(500, { error: 'Błąd serwera.' });
  }
};
