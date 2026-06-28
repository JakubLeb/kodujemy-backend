
function App() {
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState({ name: 'dashboard' });
    const [toast, setToast] = useState(null);
    const [session, setSession] = useState(null);
    const [authMode, setAuthMode] = useState('login');
    const [user, setUser] = useState({
        name: 'Gość',
        email: '',
        xp: 0,
        streak: 1,
        solvedTasks: [],
        completedLessons: [],
        coursesProgress: {},
    });
    const [activity, setActivity] = useState([]);
    const [savedCodes, setSavedCodes] = useState({});
    const [playgroundCode, setPlaygroundCode] = useState('');

    const showToast = (title, message, type = 'success') => setToast({ title, message, type });

    const applyLoadedState = (data) => {
        setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            xp: data.user.xp || 0,
            streak: data.user.streak || 1,
            solvedTasks: data.user.solvedTasks || [],
            completedLessons: data.user.completedLessons || [],
            coursesProgress: data.user.coursesProgress || {},
        });
        setActivity(data.activity || []);
        setSavedCodes(data.savedCodes || {});
        setPlaygroundCode(data.user.playgroundCode || '');
        setSession({
            userId: data.user.id,
            name: data.user.name,
            email: data.user.email,
        });
    };

    useEffect(() => {
        (async () => {
            const token = API.getToken();
            if (token) {
                try {
                    const data = await API.session();
                    applyLoadedState(data);
                } catch (e) {
                    if (e.status === 401) {
                        API.setToken(null);
                    } else {
                        console.warn('Nie udało się przywrócić sesji:', e.message);
                    }
                }
            }
            setLoaded(true);
            getPyodide().catch(() => {});
        })();
    }, []);

    useEffect(() => {
        if (!loaded || !session) return;
        const t = setTimeout(() => {
            API.savePlayground({ code: playgroundCode }).catch(e => console.warn('savePlayground:', e.message));
        }, 800);
        return () => clearTimeout(t);
    }, [playgroundCode, loaded, session]);

    const handleLogin = async (data) => {
        applyLoadedState(data);
        setPage({ name: 'dashboard' });
        showToast('👋 Witaj!', `Zalogowano jako ${data.user.name}.`, 'success');
    };

    const handleLogout = async () => {
        try { await API.logout(); } catch {}
        API.setToken(null);
        setSession(null);
        setUser({
            name: 'Gość', email: '', xp: 0, streak: 1,
            solvedTasks: [], completedLessons: [], coursesProgress: {},
        });
        setActivity([]);
        setSavedCodes({});
        setPlaygroundCode('');
        setPage({ name: 'dashboard' });
        setAuthMode('login');
    };

    const solveTask = async (task) => {
        if (user.solvedTasks.includes(task.id)) {
            showToast('Zadanie już rozwiązane', 'Wszystkie testy przeszły, ale XP nie naliczamy ponownie.', 'info');
            return;
        }
        try {
            const res = await API.solveTask({
                taskId: task.id,
                title: task.title,
                category: task.category,
                xp: task.xp,
            });
            if (res.alreadySolved) {
                showToast('Zadanie już rozwiązane', 'XP nie naliczamy ponownie.', 'info');
                setUser(u => ({ ...u, solvedTasks: [...new Set([...u.solvedTasks, task.id])] }));
                return;
            }
            setUser(u => ({
                ...u,
                xp: res.newXp,
                solvedTasks: [...u.solvedTasks, task.id]
            }));
            setActivity(a => [res.activityItem, ...a].slice(0, 30));
            showToast('🎉 Świetnie!', `Rozwiązałeś zadanie i zdobyłeś ${task.xp} XP.`, 'success');
        } catch (e) {
            showToast('Błąd zapisu', e.message, 'error');
        }
    };

    const completeLesson = async (courseId, lesson) => {
        if (user.completedLessons.includes(lesson.id)) {
            showToast('Lekcja już ukończona', 'Punkty XP zostały już naliczone.', 'info');
            return;
        }
        const course = COURSES.find(c => c.id === courseId);
        try {
            const res = await API.completeLesson({
                courseId,
                lessonId: lesson.id,
                lessonName: lesson.name,
                courseTitle: course?.title || '',
                xp: lesson.xp,
            });
            if (res.alreadyCompleted) {
                showToast('Lekcja już ukończona', 'XP nie naliczamy ponownie.', 'info');
                return;
            }
            setUser(u => ({
                ...u,
                xp: res.newXp,
                completedLessons: [...u.completedLessons, lesson.id],
                coursesProgress: { ...u.coursesProgress, [courseId]: (u.coursesProgress?.[courseId] || 0) + 1 }
            }));
            setActivity(a => [res.activityItem, ...a].slice(0, 30));
            showToast('Lekcja ukończona!', `+${lesson.xp} XP`, 'success');
        } catch (e) {
            showToast('Błąd zapisu', e.message, 'error');
        }
    };

    const saveCode = (taskId, code) => {
        setSavedCodes(prev => ({ ...prev, [taskId]: code }));
        API.saveCode({ taskId, code }).catch(e => console.warn('saveCode:', e.message));
    };

    const solvedIds = useMemo(() => new Set(user.solvedTasks), [user.solvedTasks]);

    if (!loaded) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <div className="loading-text">Ładowanie...</div>
            </div>
        );
    }

    if (!session) {
        return authMode === 'login' ? (
            <LoginPage onLogin={handleLogin} switchToRegister={() => setAuthMode('register')} />
        ) : (
            <RegisterPage onLogin={handleLogin} switchToLogin={() => setAuthMode('login')} />
        );
    }

    const showFooter = page.name !== 'editor' && page.name !== 'playground';

    return (
        <div className="app-shell">
            <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
            <main className="app-main">
                {page.name === 'dashboard' && <Dashboard setPage={setPage} user={user} activity={activity} />}
                {page.name === 'tasks' && <TasksPage setPage={setPage} solvedIds={solvedIds} />}
                {page.name === 'courses' && <CoursesPage setPage={setPage} user={user} />}
                {page.name === 'course' && <CourseDetail courseId={page.id} setPage={setPage} user={user} completeLesson={completeLesson} />}
                {page.name === 'editor' && <EditorPage
                    taskId={page.taskId}
                    setPage={setPage}
                    solveTask={solveTask}
                    savedCode={savedCodes[page.taskId]}
                    saveCode={saveCode}
                    isSolved={solvedIds.has(page.taskId)}
                />}
                {page.name === 'playground' && <PlaygroundPage
                    playgroundCode={playgroundCode}
                    setPlaygroundCode={setPlaygroundCode}
                />}
                {page.name === 'profile' && <ProfilePage user={user} activity={activity} setPage={setPage} />}
            </main>
            {showFooter && <Footer setPage={setPage} />}
            <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
