
function Dashboard({ setPage, user, activity }) {
    const pathStats = COURSES.map(c => {
        const totalLessons = c.lessons.length;
        const done = (user.coursesProgress?.[c.id] || 0);
        return { course: c, done: Math.min(done, totalLessons), total: totalLessons };
    });

    return (
        <div className="container">
            <main className="main-content">
                <h2>Ścieżki nauki</h2>
                <div className="cards-wrapper">
                    {pathStats.map(({ course, done, total }) => {
                        const pct = Math.round((done / total) * 100);
                        return (
                            <div className="card" key={course.id} onClick={() => setPage({ name: 'course', id: course.id })}>
                                <h3>{course.title}</h3>
                                <div className="card-stats">
                                    <div className="stat">Zrobione<span className="stat-val">{done}</span></div>
                                    <div className="stat">Wszystkie<span className="stat-val">{total}</span></div>
                                </div>
                                <div className={`circle ${done === 0 ? 'empty' : ''}`} style={{ '--pct': pct }} title={`${done} z ${total} lekcji`} role="img" aria-label={`Ukończono ${pct}% lekcji (${done} z ${total})`}><span>{pct}%</span></div>
                            </div>
                        );
                    })}
                </div>

                <h2>Ostatnia aktywność</h2>
                {activity.length === 0 ? (
                    <div className="empty-state" style={{background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:'var(--radius)'}}>
                        <div className="empty-state-icon">🚀</div>
                        <div>Brak aktywności. Rozwiąż swoje pierwsze zadanie!</div>
                    </div>
                ) : (
                    <div className="activity-list">
                        {activity.slice(0, 5).map((a, i) => (
                            <div className={`activity-item ${a.taskId ? '' : 'static'}`} key={i}
                                onClick={() => a.taskId && setPage({ name: 'editor', taskId: a.taskId })}
                                title={a.taskId ? 'Otwórz zadanie' : undefined}>
                                <div className="activity-left">
                                    <div className="activity-icon">{a.icon || 'Py'}</div>
                                    <div className="activity-text">
                                        <h4>{a.title}</h4>
                                        <p>{a.subtitle} • {formatTime(a.timestamp)}</p>
                                    </div>
                                </div>
                                <div className="activity-xp">+ {a.xp} XP</div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <aside className="sidebar">
                <div className="daily-challenge">
                    <h3>Dzienne Wyzwanie</h3>
                    <p>Codziennie nowe zadanie • +bonus XP</p>
                    <button onClick={() => setPage({ name: 'tasks' })}>Wybierz zadanie →</button>
                </div>

                <div className="ranking-card">
                    <h2>Globalny Ranking</h2>
                    <LeaderboardWidget userId={user.id} />
                </div>
            </aside>
        </div>
    );
}

function TasksPage({ setPage, solvedIds }) {
    const [diff, setDiff] = useState('all');
    const [search, setSearch] = useState('');
    const filtered = TASKS.filter(t => {
        if (diff !== 'all' && t.difficulty !== diff) return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const diffLabel = { easy: 'Łatwy', medium: 'Średni', hard: 'Trudny' };

    return (
        <div className="full-page">
            <h1 className="page-title">Zadania</h1>
            <p className="page-subtitle">Wybierz zadanie i zacznij kodować. Każde rozwiązane zadanie to nowe XP.</p>
            <div className="filters-bar">
                {[['all','Wszystkie'],['easy','Łatwe'],['medium','Średnie'],['hard','Trudne']].map(([id, label]) => (
                    <button key={id} className={`filter-btn ${diff === id ? 'active' : ''}`} onClick={() => setDiff(id)}>{label}</button>
                ))}
                <input className="search-input" placeholder="Szukaj zadania..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="task-grid">
                {filtered.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon">🔍</div><div>Brak zadań spełniających kryteria.</div></div>
                ) : filtered.map(t => {
                    const done = solvedIds.has(t.id);
                    return (
                        <div className="task-row" key={t.id} onClick={() => setPage({ name: 'editor', taskId: t.id })}>
                            <div className="task-row-left">
                                <div className={`task-status ${done ? 'done' : ''}`}>{done ? '✓' : '○'}</div>
                                <div className="task-info">
                                    <div className="task-name">{t.title}</div>
                                    <div className="task-meta">{t.category}</div>
                                </div>
                            </div>
                            <div className="task-row-right">
                                <div className={`difficulty ${t.difficulty}`}>{diffLabel[t.difficulty]}</div>
                                <div className="task-xp">+{t.xp} XP</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CoursesPage({ setPage, user }) {
    return (
        <div className="full-page">
            <h1 className="page-title">Kursy</h1>
            <p className="page-subtitle">Uporządkowane ścieżki nauki krok po kroku — od podstaw po zaawansowane techniki.</p>
            <div className="courses-grid">
                {COURSES.map(c => {
                    const done = user.coursesProgress?.[c.id] || 0;
                    const pct = Math.round((done / c.lessons.length) * 100);
                    return (
                        <div className="course-card" key={c.id} onClick={() => setPage({ name: 'course', id: c.id })}>
                            <div className="course-header">
                                <div className="course-icon" style={{ background: c.color }}>{c.icon}</div>
                                <div>
                                    <div className="course-title">{c.title}</div>
                                    <div className="course-subtitle">{c.subtitle}</div>
                                </div>
                            </div>
                            <div className="course-desc">{c.description}</div>
                            <div>
                                <div className="progress-row">
                                    <span>{done} z {c.lessons.length} lekcji</span>
                                    <span style={{color: 'var(--primary)', fontWeight: 600}}>{pct}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CourseDetail({ courseId, setPage, user, completeLesson }) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return <div className="full-page"><div className="empty-state">Kurs nie został znaleziony.</div></div>;
    const completedLessons = new Set(user.completedLessons || []);

    return (
        <div className="full-page">
            <a className="back-link" onClick={() => setPage({ name: 'courses' })}>← Wróć do kursów</a>
            <div style={{display:'flex', alignItems:'center', gap:'18px', marginBottom: '15px'}}>
                <div className="course-icon" style={{ background: course.color, width:'60px', height:'60px', fontSize:'24px' }}>{course.icon}</div>
                <div>
                    <h1 className="page-title" style={{marginBottom:'3px'}}>{course.title}</h1>
                    <p style={{color:'var(--text-muted)'}}>{course.description}</p>
                </div>
            </div>
            <h2 style={{marginTop:'30px'}}>Lekcje</h2>
            <div className="lessons-list">
                {course.lessons.map((l, idx) => {
                    const done = completedLessons.has(l.id);
                    return (
                        <div className="lesson-item" key={l.id} onClick={() => completeLesson(course.id, l)}>
                            <div className={`lesson-num ${done ? 'done' : ''}`}>{done ? '✓' : idx + 1}</div>
                            <div className="lesson-name">{l.name}</div>
                            <div className="lesson-xp">+{l.xp} XP</div>
                        </div>
                    );
                })}
            </div>
            <p style={{marginTop:'20px', fontSize:'13px', color:'var(--text-muted)', fontStyle:'italic'}}>
                Kliknij lekcję, aby oznaczyć ją jako ukończoną i zdobyć XP. (W docelowej wersji każda lekcja będzie zawierała materiały i interaktywne ćwiczenia.)
            </p>
        </div>
    );
}

function ProfilePage({ user, activity, setPage }) {
    const totalTasks = TASKS.length;
    const solvedCount = user.solvedTasks?.length || 0;
    const totalLessons = COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
    const completedLessonsCount = user.completedLessons?.length || 0;

    const level = Math.floor(user.xp / 200) + 1;
    const xpInLevel = user.xp % 200;
    const xpToNext = 200 - xpInLevel;
    const levelProgress = (xpInLevel / 200) * 100;

    const allBadges = [
        { id: 'first-task', icon: '🎯', name: 'Pierwszy krok', desc: 'Rozwiąż 1 zadanie', earned: solvedCount >= 1 },
        { id: 'five-tasks', icon: '🔥', name: 'Rozgrzewka', desc: 'Rozwiąż 5 zadań', earned: solvedCount >= 5 },
        { id: 'ten-tasks', icon: '💪', name: 'Wytrwałość', desc: 'Rozwiąż 10 zadań', earned: solvedCount >= 10 },
        { id: 'first-lesson', icon: '📚', name: 'Uczeń', desc: 'Ukończ 1 lekcję', earned: completedLessonsCount >= 1 },
        { id: 'xp-500', icon: '⭐', name: 'Zbieracz XP', desc: 'Zdobądź 500 XP', earned: user.xp >= 500 },
        { id: 'xp-1000', icon: '🌟', name: 'Mistrz XP', desc: 'Zdobądź 1000 XP', earned: user.xp >= 1000 },
        { id: 'streak-7', icon: '🔥', name: 'Tydzień z rzędu', desc: '7-dniowy streak', earned: user.streak >= 7 },
        { id: 'course-done', icon: '🏆', name: 'Absolwent', desc: 'Ukończ cały kurs', earned: Object.entries(user.coursesProgress || {}).some(([cid, n]) => {
            const c = COURSES.find(x => x.id === cid);
            return c && n >= c.lessons.length;
        }) },
    ];
    const earnedCount = allBadges.filter(b => b.earned).length;

    return (
        <div className="full-page">
            <a className="back-link" onClick={() => setPage({ name: 'dashboard' })}>← Wróć do panelu</a>

            <div className="profile-header">
                <div className="profile-avatar-big">{user.name[0]?.toUpperCase() || '?'}</div>
                <div className="profile-info">
                    <div className="profile-name">{user.name}</div>
                    {user.email && <div className="profile-email">{user.email}</div>}
                    <div className="profile-level-badge">🎓 Poziom {level} • {xpToNext} XP do następnego</div>
                </div>
            </div>

            <h2>Statystyki nauki</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-label">Punkty XP</div>
                    <div className="stat-card-value">{user.xp}</div>
                    <div className="stat-card-sub">Poziom {level} • {Math.round(levelProgress)}% do kolejnego</div>
                    <div className="progress-bar" style={{marginTop:'10px'}}>
                        <div className="progress-fill" style={{width: `${levelProgress}%`}}></div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Ukończone zadania</div>
                    <div className="stat-card-value">{solvedCount}</div>
                    <div className="stat-card-sub">z {totalTasks} dostępnych</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Ukończone lekcje</div>
                    <div className="stat-card-value">{completedLessonsCount}</div>
                    <div className="stat-card-sub">z {totalLessons} dostępnych</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Streak</div>
                    <div className="stat-card-value">🔥 {user.streak}</div>
                    <div className="stat-card-sub">dni z rzędu</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-label">Zdobyte odznaki</div>
                    <div className="stat-card-value">{earnedCount} / {allBadges.length}</div>
                    <div className="stat-card-sub">{Math.round(earnedCount / allBadges.length * 100)}% kolekcji</div>
                </div>
            </div>

            <h2>Odznaki</h2>
            <div className="badges-grid" style={{marginBottom:'30px'}}>
                {allBadges.map(b => (
                    <div className={`badge-card ${b.earned ? 'earned' : 'locked'}`} key={b.id}>
                        <span className="badge-icon">{b.earned ? b.icon : '🔒'}</span>
                        <div className="badge-name">{b.name}</div>
                        <div className="badge-desc">{b.desc}</div>
                    </div>
                ))}
            </div>

            <h2>Postęp w kursach</h2>
            <div className="courses-grid" style={{marginBottom:'30px'}}>
                {COURSES.map(c => {
                    const done = user.coursesProgress?.[c.id] || 0;
                    const pct = Math.round((done / c.lessons.length) * 100);
                    return (
                        <div className="course-card" key={c.id} onClick={() => setPage({ name: 'course', id: c.id })}>
                            <div className="course-header">
                                <div className="course-icon" style={{ background: c.color }}>{c.icon}</div>
                                <div>
                                    <div className="course-title">{c.title}</div>
                                    <div className="course-subtitle">{c.subtitle}</div>
                                </div>
                            </div>
                            <div>
                                <div className="progress-row">
                                    <span>{done} z {c.lessons.length} lekcji</span>
                                    <span style={{color: 'var(--primary)', fontWeight: 600}}>{pct}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <h2>Ostatnia aktywność</h2>
            {activity.length === 0 ? (
                <div className="empty-state" style={{background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:'var(--radius)'}}>
                    <div className="empty-state-icon">🚀</div>
                    <div>Brak aktywności. Czas zacząć rozwiązywać zadania!</div>
                </div>
            ) : (
                <div className="activity-list">
                    {activity.slice(0, 10).map((a, i) => (
                        <div className={`activity-item ${a.taskId ? '' : 'static'}`} key={i}
                            onClick={() => a.taskId && setPage({ name: 'editor', taskId: a.taskId })}
                            title={a.taskId ? 'Otwórz zadanie' : undefined}>
                            <div className="activity-left">
                                <div className="activity-icon">{a.icon || 'Py'}</div>
                                <div className="activity-text">
                                    <h4>{a.title}</h4>
                                    <p>{a.subtitle} • {formatTime(a.timestamp)}</p>
                                </div>
                            </div>
                            <div className="activity-xp">+ {a.xp} XP</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

