const crypto = require('crypto');
const { sql } = require('./db');

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

function preflight(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  return null;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(candidate, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function newToken() {
  return crypto.randomBytes(32).toString('hex');
}

function newId(prefix = 'u') {
  return prefix + '_' + crypto.randomBytes(12).toString('hex');
}

const SESSION_TTL_DAYS = 30;

async function createSession(userId) {
  const token = newToken();
  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, now() + (${SESSION_TTL_DAYS} * INTERVAL '1 day'))`;
  return token;
}

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
      AND (s.expires_at IS NULL OR s.expires_at > now())
    LIMIT 1`;
  if (rows[0]) return rows[0];
  sql`DELETE FROM sessions WHERE token = ${token} AND expires_at <= now()`.catch(() => {});
  return null;
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

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

function activityRowToItem(row) {
  return {
    icon: row.icon,
    title: row.title,
    subtitle: row.subtitle,
    xp: row.xp,
    taskId: row.task_id || undefined,
    timestamp: row.created_at,
  };
}

module.exports = {
  json,
  preflight,
  hashPassword,
  verifyPassword,
  newToken,
  newId,
  createSession,
  getUserFromAuth,
  parseBody,
  buildUserState,
  activityRowToItem,
};
