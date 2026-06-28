// Wspólne narzędzia używane przez wszystkie funkcje.
const crypto = require('crypto');
const { sql } = require('./db');

// --- Odpowiedzi JSON + CORS ---
// CORS jest tu właściwie zbędny (front i API na tej samej domenie Netlify),
// ale nie szkodzi i ułatwia testy lokalne.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...CORS },
    body: JSON.stringify(body),
  };
}

// Obsługa preflightu OPTIONS - zwróć z każdej funkcji na początku.
function preflight(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  return null;
}

// --- Hasła ---
// scrypt z modułu crypto (wbudowany w Node) - bez zależności zewnętrznych.
// Format przechowywania: "salt:hash" (hex).
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  // Porównanie w stałym czasie.
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(candidate, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// --- Tokeny / sesje ---
// Prosty, nieprzewidywalny token sesji zapisywany w tabeli `sessions`.
// (Świadomie nie JWT - mniej rzeczy do pomylenia, łatwe unieważnianie.)
function newToken() {
  return crypto.randomBytes(32).toString('hex');
}

function newId(prefix = 'u') {
  return prefix + '_' + crypto.randomBytes(12).toString('hex');
}

// Wyciąga usera na podstawie nagłówka Authorization: Bearer <token>.
// Zwraca obiekt usera (z bazy) albo null.
async function getUserFromAuth(event) {
  const header =
    event.headers.authorization || event.headers.Authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1].trim();
  const rows = await sql`
    SELECT u.* FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token}
    LIMIT 1`;
  return rows[0] || null;
}

// Parsuje body żądania jako JSON (bezpiecznie).
function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

// --- Budowanie pełnego stanu użytkownika dla frontendu ---
// Frontend (applyLoadedState) oczekuje kształtu:
//   { user: { id, name, email, xp, streak, solvedTasks[], completedLessons[],
//             coursesProgress{}, playgroundCode },
//     activity: [ { icon, title, subtitle, xp, taskId, timestamp } ],
//     savedCodes: { [taskId]: code } }
async function buildUserState(user) {
  const [solved, lessons, codes, acts] = await Promise.all([
    sql`SELECT task_id FROM solved_tasks WHERE user_id = ${user.id}`,
    sql`SELECT lesson_id, course_id FROM completed_lessons WHERE user_id = ${user.id}`,
    sql`SELECT task_id, code FROM saved_codes WHERE user_id = ${user.id}`,
    sql`SELECT icon, title, subtitle, xp, task_id, created_at
        FROM activity WHERE user_id = ${user.id}
        ORDER BY created_at DESC LIMIT 30`,
  ]);

  const coursesProgress = {};
  for (const row of lessons) {
    coursesProgress[row.course_id] = (coursesProgress[row.course_id] || 0) + 1;
  }

  const savedCodes = {};
  for (const row of codes) savedCodes[row.task_id] = row.code;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      streak: user.streak,
      solvedTasks: solved.map((r) => r.task_id),
      completedLessons: lessons.map((r) => r.lesson_id),
      coursesProgress,
      playgroundCode: user.playground_code || '',
    },
    activity: acts.map(activityRowToItem),
    savedCodes,
  };
}

// Mapuje wiersz z tabeli activity na obiekt oczekiwany przez frontend.
function activityRowToItem(row) {
  return {
    icon: row.icon,
    title: row.title,
    subtitle: row.subtitle,
    xp: row.xp,
    taskId: row.task_id || undefined,
    timestamp: row.created_at, // ISO string; frontend ma formatTime()
  };
}

module.exports = {
  json,
  preflight,
  hashPassword,
  verifyPassword,
  newToken,
  newId,
  getUserFromAuth,
  parseBody,
  buildUserState,
  activityRowToItem,
};
