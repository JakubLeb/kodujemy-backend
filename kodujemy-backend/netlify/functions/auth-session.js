// GET /api/auth/session   (wymaga Bearer token)
// Zwraca pełny stan: { user, activity, savedCodes }
// Frontend woła to przy starcie, jeśli ma zapisany token.
const { ensureSchema } = require('./utils/db');
const { json, preflight, getUserFromAuth, buildUserState } = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;

  try {
    await ensureSchema();
    const user = await getUserFromAuth(event);
    if (!user) {
      // 401 -> frontend wyczyści token i pokaże ekran logowania.
      return json(401, { error: 'Sesja wygasła lub token nieprawidłowy.' });
    }
    const state = await buildUserState(user);
    return json(200, state);
  } catch (e) {
    console.error('session error:', e);
    return json(500, { error: 'Błąd serwera.' });
  }
};
