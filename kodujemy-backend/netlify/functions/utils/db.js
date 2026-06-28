const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('Brak zmiennej DATABASE_URL!');
}

const sql = neon(process.env.DATABASE_URL);

let schemaReady = null;
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id            TEXT PRIMARY KEY,
          name          TEXT NOT NULL,
          email         TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          xp            INTEGER NOT NULL DEFAULT 0,
          streak        INTEGER NOT NULL DEFAULT 1,
          playground_code TEXT NOT NULL DEFAULT '',
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          token      TEXT PRIMARY KEY,
          user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ`;
      await sql`UPDATE sessions SET expires_at = created_at + INTERVAL '30 days' WHERE expires_at IS NULL`;
      await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`;
      await sql`
        CREATE TABLE IF NOT EXISTS solved_tasks (
          user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          task_id   TEXT NOT NULL,
          solved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, task_id)
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS completed_lessons (
          user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          lesson_id    TEXT NOT NULL,
          course_id    TEXT NOT NULL,
          completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, lesson_id)
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS saved_codes (
          user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          task_id    TEXT NOT NULL,
          code       TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, task_id)
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS activity (
          id         BIGSERIAL PRIMARY KEY,
          user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          icon       TEXT NOT NULL DEFAULT 'Py',
          title      TEXT NOT NULL,
          subtitle   TEXT NOT NULL DEFAULT '',
          xp         INTEGER NOT NULL DEFAULT 0,
          task_id    TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_activity_user ON activity(user_id, created_at DESC)`;
    })();
  }
  return schemaReady;
}

module.exports = { sql, ensureSchema };
