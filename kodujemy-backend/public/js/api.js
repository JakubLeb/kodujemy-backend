
const TOKEN_STORAGE_KEY = 'kodujemy_token';

const API = {
    getToken() {
        try { return localStorage.getItem(TOKEN_STORAGE_KEY) || null; }
        catch { return null; }
    },
    setToken(t) {
        try {
            if (t) localStorage.setItem(TOKEN_STORAGE_KEY, t);
            else localStorage.removeItem(TOKEN_STORAGE_KEY);
        } catch {}
    },
    async request(path, { method = 'GET', body = null, auth = true } = {}) {
        const headers = { 'Content-Type': 'application/json' };
        if (auth) {
            const t = this.getToken();
            if (t) headers['Authorization'] = 'Bearer ' + t;
        }
        const opts = { method, headers };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(path, opts);
        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
        if (!res.ok) {
            const err = new Error((data && data.error) || `HTTP ${res.status}`);
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return data;
    },
    register({ name, email, password }) {
        return this.request('/api/auth/register', { method: 'POST', body: { name, email, password }, auth: false });
    },
    login({ email, password }) {
        return this.request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });
    },
    session() {
        return this.request('/api/auth/session');
    },
    logout() {
        return this.request('/api/auth/logout', { method: 'POST' });
    },
    solveTask({ taskId, title, category, xp }) {
        return this.request('/api/solve-task', { method: 'POST', body: { taskId, title, category, xp } });
    },
    completeLesson({ courseId, lessonId, lessonName, courseTitle, xp }) {
        return this.request('/api/complete-lesson', {
            method: 'POST',
            body: { courseId, lessonId, lessonName, courseTitle, xp }
        });
    },
    saveCode({ taskId, code }) {
        return this.request('/api/save-code', { method: 'POST', body: { taskId, code } });
    },
    savePlayground({ code }) {
        return this.request('/api/save-playground', { method: 'POST', body: { code } });
    },
    leaderboard(limit = 10) {
        return this.request('/api/leaderboard?limit=' + limit, { auth: true });
    },
};

