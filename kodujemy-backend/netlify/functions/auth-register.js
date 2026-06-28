// POST /api/auth/register  { name, email, password }
// Zwraca: { token, user, activity, savedCodes }
const { ensureSchema } = require('./utils/db');
const { sql } = require('./utils/db');
const {
  json, preflight, parseBody, hashPassword, createSession, newId, buildUserState,
} = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metoda niedozwolona' });

  try {
    await ensureSchema();
    const { name, email, password } = parseBody(event);

    if (!name || !email || !password) {
      return json(400, { error: 'Podaj imię, email i hasło.' });
    }
    if (String(password).length < 6) {
      return json(400, { error: 'Hasło musi mieć min. 6 znaków.' });
    }

    const emailNorm = String(email).trim().toLowerCase();

    const existing = await sql`SELECT id FROM users WHERE email = ${emailNorm} LIMIT 1`;
    if (existing.length > 0) {
      return json(409, { error: 'Konto z tym adresem email już istnieje.' });
    }

    const id = newId('u');
    const passwordHash = hashPassword(password);

    const inserted = await sql`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (${id}, ${String(name).trim()}, ${emailNorm}, ${passwordHash})
      RETURNING *`;
    const user = inserted[0];

    const token = await createSession(user.id);

    const state = await buildUserState(user);
    return json(200, { token, ...state });
  } catch (e) {
    console.error('register error:', e);
    return json(500, { error: 'Błąd serwera przy rejestracji.' });
  }
};
