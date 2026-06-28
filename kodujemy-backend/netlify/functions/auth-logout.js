const { ensureSchema, sql } = require('./utils/db');
const { json, preflight } = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metoda niedozwolona' });

  try {
    await ensureSchema();
    const header = event.headers.authorization || event.headers.Authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (match) {
      const token = match[1].trim();
      await sql`DELETE FROM sessions WHERE token = ${token}`;
    }
    return json(200, { ok: true });
  } catch (e) {
    console.error('logout error:', e);
    return json(200, { ok: true });
  }
};
