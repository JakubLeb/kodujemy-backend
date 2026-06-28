const { ensureSchema } = require('./utils/db');
const { json, preflight, getUserFromAuth, buildUserState } = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;

  try {
    await ensureSchema();
    const user = await getUserFromAuth(event);
    if (!user) {
      return json(401, { error: 'Sesja wygasła lub token nieprawidłowy.' });
    }
    const state = await buildUserState(user);
    return json(200, state);
  } catch (e) {
    console.error('session error:', e);
    return json(500, { error: 'Błąd serwera.' });
  }
};
