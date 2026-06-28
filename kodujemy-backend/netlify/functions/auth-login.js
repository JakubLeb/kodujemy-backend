// POST /api/auth/login  { email, password }
// Zwraca: { token, user, activity, savedCodes }
const { ensureSchema, sql } = require('./utils/db');
const {
  json, preflight, parseBody, verifyPassword, createSession, buildUserState,
} = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metoda niedozwolona' });

  try {
    await ensureSchema();
    const { email, password } = parseBody(event);
    if (!email || !password) {
      return json(400, { error: 'Podaj email i hasło.' });
    }

    const emailNorm = String(email).trim().toLowerCase();
    const rows = await sql`SELECT * FROM users WHERE email = ${emailNorm} LIMIT 1`;
    const user = rows[0];

    // Ten sam komunikat dla "brak usera" i "złe hasło" - nie zdradzamy, czy email istnieje.
    if (!user || !verifyPassword(password, user.password_hash)) {
      return json(401, { error: 'Nieprawidłowy email lub hasło.' });
    }

    const token = await createSession(user.id);

    const state = await buildUserState(user);
    return json(200, { token, ...state });
  } catch (e) {
    console.error('login error:', e);
    return json(500, { error: 'Błąd serwera przy logowaniu.' });
  }
};
