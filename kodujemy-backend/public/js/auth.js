
function LoginPage({ onLogin, switchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        if (!email.trim() || !password) {
            setError('Wypełnij wszystkie pola.');
            return;
        }
        setLoading(true);
        try {
            const data = await API.login({ email: email.trim(), password });
            API.setToken(data.token);
            onLogin(data);
        } catch (e) {
            setError(e.message || 'Coś poszło nie tak.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <AuthBackground />
            <div className="auth-card">
                <div className="auth-logo">Kodujemy</div>
                <p className="auth-tagline">Naucz się programować przez praktykę</p>

                <h1 className="auth-title">Zaloguj się</h1>
                <p className="auth-subtitle">Witaj z powrotem! Kontynuuj naukę od miejsca, w którym skończyłeś.</p>

                <form className="auth-form" onSubmit={submit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-email">Adres e-mail</label>
                        <input id="login-email" className="form-input" type="email"
                            name="username" autoComplete="username"
                            value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="np. jan@example.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-password">Hasło</label>
                        <input id="login-password" className="form-input" type="password"
                            name="password" autoComplete="current-password"
                            value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="Twoje hasło" />
                    </div>

                    {error && <div className="form-error" style={{marginBottom:'8px'}}>{error}</div>}

                    <button type="submit" className="btn-primary-full" disabled={loading}>
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </form>

                <div className="auth-divider">lub</div>
                <p className="auth-switch">
                    Nie masz konta? <a onClick={switchToRegister}>Załóż je</a>
                </p>
                <p className="site-footer-copy" style={{textAlign:'center', marginTop:'22px'}}>
                    © {new Date().getFullYear()} Kodujemy. Wszelkie prawa zastrzeżone.
                </p>
            </div>
        </div>
    );
}

function RegisterPage({ onLogin, switchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!name.trim() || name.trim().length < 2) e.name = 'Imię musi mieć co najmniej 2 znaki.';
        if (!email.trim()) e.email = 'Podaj adres e-mail.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Nieprawidłowy format e-maila.';
        if (!password) e.password = 'Podaj hasło.';
        else if (password.length < 8) e.password = 'Hasło musi mieć co najmniej 8 znaków.';
        if (password !== password2) e.password2 = 'Hasła nie są identyczne.';
        if (!agree) e.agree = 'Musisz zaakceptować regulamin.';
        return e;
    };

    const submit = async (e) => {
        if (e) e.preventDefault();
        const eMap = validate();
        setErrors(eMap);
        if (Object.keys(eMap).length > 0) return;

        setLoading(true);
        try {
            const data = await API.register({
                name: name.trim(),
                email: email.trim(),
                password,
            });
            API.setToken(data.token);
            onLogin(data);
        } catch (e) {
            if (e.status === 409) {
                setErrors({ email: 'Konto z tym e-mailem już istnieje.' });
            } else {
                setErrors({ general: 'Rejestracja nie powiodła się: ' + e.message });
            }
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <AuthBackground />
            <div className="auth-card">
                <div className="auth-logo">Kodujemy</div>
                <p className="auth-tagline">Naucz się programować przez praktykę</p>

                <h1 className="auth-title">Załóż konto</h1>
                <p className="auth-subtitle">Zacznij naukę za darmo. Twoje postępy będą zapisywane automatycznie.</p>

                <form className="auth-form" onSubmit={submit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-name">Imię (lub pseudonim)</label>
                        <input id="reg-name" className={`form-input ${errors.name ? 'error' : ''}`} type="text"
                            name="name" autoComplete="name"
                            value={name} onChange={e => setName(e.target.value)} placeholder="np. Jan" />
                        {errors.name && <div className="form-error">{errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-email">Adres e-mail</label>
                        <input id="reg-email" className={`form-input ${errors.email ? 'error' : ''}`} type="email"
                            name="username" autoComplete="username"
                            value={email} onChange={e => setEmail(e.target.value)} placeholder="np. jan@example.com" />
                        {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-password">Hasło</label>
                        <input id="reg-password" className={`form-input ${errors.password ? 'error' : ''}`} type="password"
                            name="new-password" autoComplete="new-password"
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="Co najmniej 8 znaków" />
                        {errors.password ? <div className="form-error">{errors.password}</div>
                            : <div className="form-hint">Minimum 8 znaków.</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-password2">Powtórz hasło</label>
                        <input id="reg-password2" className={`form-input ${errors.password2 ? 'error' : ''}`} type="password"
                            name="confirm-password" autoComplete="new-password"
                            value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Wpisz hasło ponownie" />
                        {errors.password2 && <div className="form-error">{errors.password2}</div>}
                    </div>

                    <div className="checkbox-row">
                        <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                        <label htmlFor="agree">
                            Akceptuję regulamin i politykę prywatności platformy Kodujemy.
                        </label>
                    </div>
                    {errors.agree && <div className="form-error">{errors.agree}</div>}
                    {errors.general && <div className="form-error" style={{marginTop:'8px'}}>{errors.general}</div>}

                    <button type="submit" className="btn-primary-full" disabled={loading}>
                        {loading ? 'Tworzę konto...' : 'Załóż konto'}
                    </button>
                </form>

                <div className="auth-divider">lub</div>
                <p className="auth-switch">
                    Masz już konto? <a onClick={switchToLogin}>Zaloguj się</a>
                </p>
                <p className="site-footer-copy" style={{textAlign:'center', marginTop:'22px'}}>
                    © {new Date().getFullYear()} Kodujemy. Wszelkie prawa zastrzeżone.
                </p>
            </div>
        </div>
    );
}

