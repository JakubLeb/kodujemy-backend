
function Toast({ toast, onClose }) {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [toast]);
    if (!toast) return null;
    return (
        <div className={`toast ${toast.type || ''}`}>
            <div className="toast-title">{toast.title}</div>
            {toast.message && <div className="toast-msg">{toast.message}</div>}
        </div>
    );
}

function Navbar({ page, setPage, user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const menuRef = useRef(null);
    const navRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    useEffect(() => {
        if (!navOpen) return;
        const handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) setNavOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [navOpen]);

    const links = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'tasks', label: 'Zadania' },
        { id: 'courses', label: 'Kursy' },
        { id: 'playground', label: 'Edytor kodu' },
    ];

    const go = (target) => { setMenuOpen(false); setPage(target); };
    const goNav = (id) => { setNavOpen(false); setPage({ name: id }); };

    return (
        <header className="navbar" ref={navRef}>
            <button
                className="nav-toggle"
                aria-label="Menu"
                aria-expanded={navOpen}
                onClick={() => setNavOpen(o => !o)}
            >
                <span></span><span></span><span></span>
            </button>
            <div className="logo" onClick={() => setPage({ name: 'dashboard' })}>Kodujemy</div>
            <nav className="nav-links">
                {links.map(l => (
                    <a key={l.id} className={page.name === l.id ? 'active' : ''} onClick={() => setPage({ name: l.id })}>
                        {l.label}
                    </a>
                ))}
            </nav>
            <div className={`mobile-menu ${navOpen ? 'open' : ''}`}>
                {links.map(l => (
                    <a key={l.id} className={page.name === l.id ? 'active' : ''} onClick={() => goNav(l.id)}>
                        {l.label}
                    </a>
                ))}
            </div>
            <div className="user-panel">
                <div className="badge">🔥 {user.streak} dni</div>
                <div className="badge badge-xp">⭐ {user.xp} XP</div>
                <div className="avatar-wrapper" ref={menuRef}>
                    <div className="avatar-trigger" onClick={() => setMenuOpen(o => !o)} title="Otwórz menu profilu">
                        <div className="avatar">
                            {user.name[0]?.toUpperCase() || '?'}
                        </div>
                        <span className={`avatar-caret ${menuOpen ? 'open' : ''}`}>▼</span>
                    </div>
                    {menuOpen && (
                        <div className="avatar-menu">
                            <div className="avatar-menu-header">
                                <div className="avatar-menu-name">{user.name}</div>
                                {user.email && <div className="avatar-menu-email">{user.email}</div>}
                            </div>
                            <button className="avatar-menu-item" onClick={() => go({ name: 'profile' })}>
                                <span className="avatar-menu-icon">👤</span> Mój profil
                            </button>
                            <button className="avatar-menu-item" onClick={() => go({ name: 'playground' })}>
                                <span className="avatar-menu-icon">💻</span> Edytor kodu
                            </button>
                            <button className="avatar-menu-item danger" onClick={() => { setMenuOpen(false); onLogout(); }}>
                                <span className="avatar-menu-icon">↪</span> Wyloguj się
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function LeaderboardWidget({ userId }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        let cancelled = false;
        if (reloadKey > 0) setRefreshing(true);
        API.leaderboard(10)
            .then(d => { if (!cancelled) { setData(d); setError(null); } })
            .catch(e => { if (!cancelled) setError(e.message); })
            .finally(() => { if (!cancelled) setRefreshing(false); });
        return () => { cancelled = true; };
    }, [reloadKey]);

    if (error) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">⚠️</div>
                <div>Nie udało się załadować rankingu.</div>
            </div>
        );
    }
    if (!data) {
        return (
            <div className="empty-state">
                <div>Ładuję ranking...</div>
            </div>
        );
    }
    if (!data.leaderboard || data.leaderboard.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">🏆</div>
                <div>Ranking jest pusty. Bądź pierwszy!</div>
            </div>
        );
    }

    const meInTop = data.leaderboard.some(p => p.id === userId);
    const topXp = Math.max(1, ...data.leaderboard.map(p => p.xp || 0));

    return (
        <>
            <div className="ranking-head">
                <span style={{fontSize:'12px', color:'var(--text-muted)'}}>Top {data.leaderboard.length} graczy</span>
                <button
                    className="ranking-refresh"
                    onClick={() => setReloadKey(k => k + 1)}
                    disabled={refreshing}
                    title="Odśwież ranking"
                >
                    {refreshing ? '⏳' : '⟳'} Odśwież
                </button>
            </div>
            <div className="ranking-list">
                {data.leaderboard.map(p => {
                    const isMe = p.id === userId;
                    const medal = p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`;
                    const initials = (p.name || '?').trim().slice(0, 2).toUpperCase();
                    const topClass = p.rank <= 3 ? ` top${p.rank}` : '';
                    const barPct = Math.round(((p.xp || 0) / topXp) * 100);
                    return (
                        <div className={`ranking-item${topClass}`} key={p.id} style={isMe ? {background:'#eef2ff'} : {}}>
                            <div className="ranking-medal">{medal}</div>
                            <div className="ranking-avatar" style={isMe ? {background:'var(--primary)'} : {}}>{initials}</div>
                            <div className="ranking-info" style={{flex:1}}>
                                <div className="ranking-name">{p.name}{isMe && ' (Ty)'}</div>
                                <div className="ranking-points">{p.xp} XP • {p.solvedCount} zad.</div>
                                <div className="ranking-bar"><div style={{width: barPct + '%'}}></div></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {data.me && !meInTop && (
                <div style={{marginTop:'14px', paddingTop:'14px', borderTop:'1px dashed var(--border)'}}>
                    <div className="ranking-item" style={{background:'#eef2ff', margin:0, padding:'10px', borderRadius:'8px', borderBottom:'none'}}>
                        <div style={{minWidth:'28px', fontWeight:700, color:'var(--text-muted)', fontSize:'14px'}}>#{data.me.rank}</div>
                        <div className="ranking-avatar" style={{background:'var(--primary)'}}>
                            {(data.me.name || '?').trim().slice(0,2).toUpperCase()}
                        </div>
                        <div className="ranking-info" style={{flex:1}}>
                            <div className="ranking-name">{data.me.name} (Ty)</div>
                            <div className="ranking-points">{data.me.xp} XP</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function Footer({ setPage }) {
    const year = new Date().getFullYear();
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div>
                    <span className="site-footer-brand">Kodujemy</span>
                    <span className="site-footer-copy" style={{marginLeft:'10px'}}>
                        © {year} Kodujemy. Wszelkie prawa zastrzeżone.
                    </span>
                </div>
                <nav className="site-footer-links">
                    <a onClick={() => setPage && setPage({ name: 'tasks' })}>Zadania</a>
                    <a onClick={() => setPage && setPage({ name: 'courses' })}>Kursy</a>
                    <a onClick={() => setPage && setPage({ name: 'playground' })}>Edytor kodu</a>
                </nav>
            </div>
        </footer>
    );
}

function AuthBackground() {
    const cubes = [
        { left: '8%',  size: 70,  dur: 16, delay: 0 },
        { left: '22%', size: 36,  dur: 12, delay: 2 },
        { left: '40%', size: 100, dur: 20, delay: 4 },
        { left: '58%', size: 50,  dur: 14, delay: 1 },
        { left: '72%', size: 28,  dur: 11, delay: 6 },
        { left: '85%', size: 80,  dur: 18, delay: 3 },
        { left: '92%', size: 44,  dur: 13, delay: 5 },
    ];
    return (
        <div className="auth-bg-cubes" aria-hidden="true">
            {cubes.map((c, i) => (
                <span key={i} style={{
                    left: c.left,
                    width: c.size + 'px',
                    height: c.size + 'px',
                    animationDuration: c.dur + 's',
                    animationDelay: c.delay + 's',
                }}></span>
            ))}
        </div>
    );
}

