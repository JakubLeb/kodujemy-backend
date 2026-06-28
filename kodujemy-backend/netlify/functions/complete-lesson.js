// POST /api/complete-lesson  { courseId, lessonId, lessonName, courseTitle, xp }  (Bearer)
// Zwraca albo { alreadyCompleted: true }  albo  { newXp, activityItem }
const { ensureSchema, sql } = require('./utils/db');
const {
  json, preflight, parseBody, getUserFromAuth, activityRowToItem,
} = require('./utils/helpers');

exports.handler = async (event) => {
  const pre = preflight(event);
  if (pre) return pre;
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metoda niedozwolona' });

  try {
    await ensureSchema();
    const user = await getUserFromAuth(event);
    if (!user) return json(401, { error: 'Niezalogowany.' });

    const { courseId, lessonId, lessonName, courseTitle, xp } = parseBody(event);
    if (!courseId || !lessonId) return json(400, { error: 'Brak courseId lub lessonId.' });

    const xpAward = Math.max(0, Math.min(1000, parseInt(xp, 10) || 0));

    const ins = await sql`
      INSERT INTO completed_lessons (user_id, lesson_id, course_id)
      VALUES (${user.id}, ${lessonId}, ${courseId})
      ON CONFLICT (user_id, lesson_id) DO NOTHING
      RETURNING lesson_id`;

    if (ins.length === 0) {
      return json(200, { alreadyCompleted: true });
    }

    const upd = await sql`
      UPDATE users SET xp = xp + ${xpAward} WHERE id = ${user.id}
      RETURNING xp`;
    const newXp = upd[0].xp;

    const title = lessonName || 'Ukończono lekcję';
    const subtitle = courseTitle ? `Kurs • ${courseTitle}` : 'Lekcja ukończona';
    const actRows = await sql`
      INSERT INTO activity (user_id, icon, title, subtitle, xp, task_id)
      VALUES (${user.id}, 'Py', ${title}, ${subtitle}, ${xpAward}, NULL)
      RETURNING icon, title, subtitle, xp, task_id, created_at`;

    return json(200, { newXp, activityItem: activityRowToItem(actRows[0]) });
  } catch (e) {
    console.error('complete-lesson error:', e);
    return json(500, { error: 'Błąd serwera przy zapisie lekcji.' });
  }
};
