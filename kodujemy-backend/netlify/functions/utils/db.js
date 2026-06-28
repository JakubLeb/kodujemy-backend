// Połączenie z bazą Neon (PostgreSQL) przez sterownik serverless.
// Connection string trzymamy WYŁĄCZNIE w zmiennej środowiskowej DATABASE_URL
// (panel Netlify -> Site settings -> Environment variables). Nigdy w kodzie.
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  // Rzucamy czytelny błąd zamiast cichego "undefined" przy starcie funkcji.
  console.error('Brak zmiennej DATABASE_URL!');
}

const sql = neon(process.env.DATABASE_URL);

// Jednorazowa inicjalizacja schematu. Wołana leniwie przy pierwszym żądaniu.
// `CREATE TABLE IF NOT EXISTS` jest idempotentne, więc bezpieczne na produkcji.
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
      // Rozwiązane zadania (jedno na parę user+task).
      await sql`
        CREATE TABLE IF NOT EXISTS solved_tasks (
          user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          task_id   TEXT NOT NULL,
          solved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, task_id)
        )`;
      // Ukończone lekcje.
      await sql`
        CREATE TABLE IF NOT EXISTS completed_lessons (
          user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          lesson_id    TEXT NOT NULL,
          course_id    TEXT NOT NULL,
          completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, lesson_id)
        )`;
      // Zapisany kod do zadań (jeden wpis na parę user+task).
      await sql`
        CREATE TABLE IF NOT EXISTS saved_codes (
          user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          task_id    TEXT NOT NULL,
          code       TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, task_id)
        )`;
      // Log aktywności (do dashboardu i profilu).
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
