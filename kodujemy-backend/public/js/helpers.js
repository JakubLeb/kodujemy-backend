
let pyodideInstance = null;
let pyodideLoadingPromise = null;

async function getPyodide() {
    if (pyodideInstance) return pyodideInstance;
    if (pyodideLoadingPromise) return pyodideLoadingPromise;
    pyodideLoadingPromise = (async () => {
        const py = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
        pyodideInstance = py;
        return py;
    })();
    return pyodideLoadingPromise;
}


const PY_KEYWORDS = new Set([
    'False','None','True','and','as','assert','async','await','break','class','continue',
    'def','del','elif','else','except','finally','for','from','global','if','import','in',
    'is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield','match','case'
]);
const PY_BUILTINS = new Set([
    'abs','all','any','ascii','bin','bool','bytearray','bytes','callable','chr','classmethod',
    'compile','complex','dict','dir','divmod','enumerate','eval','exec','filter','float','format',
    'frozenset','getattr','globals','hasattr','hash','help','hex','id','input','int','isinstance',
    'issubclass','iter','len','list','locals','map','max','min','next','object','oct','open','ord',
    'pow','print','property','range','repr','reversed','round','set','setattr','slice','sorted',
    'staticmethod','str','sum','super','tuple','type','vars','zip','__import__'
]);

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPython(src) {
    let out = '';
    let i = 0;
    const n = src.length;
    const isIdStart = c => /[A-Za-z_]/.test(c);
    const isIdCont  = c => /[A-Za-z0-9_]/.test(c);
    const isDigit   = c => /[0-9]/.test(c);

    let expectFuncName = false;

    while (i < n) {
        const c = src[i];

        if (c === '#') {
            let j = i;
            while (j < n && src[j] !== '\n') j++;
            out += `<span class="tok-com">${escapeHtml(src.slice(i, j))}</span>`;
            i = j;
            continue;
        }

        if (c === '"' || c === "'") {
            const triple = src.slice(i, i + 3);
            if (triple === '"""' || triple === "'''") {
                const quote = triple;
                let j = i + 3;
                while (j < n && src.slice(j, j + 3) !== quote) j++;
                j = Math.min(j + 3, n);
                out += `<span class="tok-str">${escapeHtml(src.slice(i, j))}</span>`;
                i = j;
                continue;
            } else {
                let j = i + 1;
                while (j < n && src[j] !== c && src[j] !== '\n') {
                    if (src[j] === '\\' && j + 1 < n) j += 2; else j++;
                }
                if (j < n && src[j] === c) j++;
                out += `<span class="tok-str">${escapeHtml(src.slice(i, j))}</span>`;
                i = j;
                continue;
            }
        }

        if (isDigit(c) || (c === '.' && i + 1 < n && isDigit(src[i + 1]))) {
            let j = i;
            while (j < n && /[0-9_.eExXoObBjJ+\-]/.test(src[j])) {
                if ((src[j] === '+' || src[j] === '-') && !/[eE]/.test(src[j-1])) break;
                j++;
            }
            out += `<span class="tok-num">${escapeHtml(src.slice(i, j))}</span>`;
            i = j;
            continue;
        }

        if (c === '@' && i + 1 < n && isIdStart(src[i+1])) {
            let j = i + 1;
            while (j < n && isIdCont(src[j])) j++;
            out += `<span class="tok-dec">${escapeHtml(src.slice(i, j))}</span>`;
            i = j;
            continue;
        }

        if (isIdStart(c)) {
            let j = i;
            while (j < n && isIdCont(src[j])) j++;
            const word = src.slice(i, j);

            let k = j;
            while (k < n && (src[k] === ' ' || src[k] === '\t')) k++;
            const isCall = src[k] === '(';

            let cls;
            if (expectFuncName) {
                cls = 'tok-fn';
                expectFuncName = false;
            } else if (word === 'self' || word === 'cls') {
                cls = 'tok-self';
            } else if (PY_KEYWORDS.has(word)) {
                cls = (word === 'def' || word === 'class') ? 'tok-def' : 'tok-kw';
                if (word === 'def' || word === 'class') expectFuncName = true;
            } else if (PY_BUILTINS.has(word)) {
                cls = 'tok-bi';
            } else if (isCall) {
                cls = 'tok-fn';
            } else {
                cls = null;
            }

            out += cls ? `<span class="${cls}">${escapeHtml(word)}</span>` : escapeHtml(word);
            i = j;
            continue;
        }

        if (/[+\-*/%=<>!&|^~]/.test(c)) {
            out += `<span class="tok-op">${escapeHtml(c)}</span>`;
            i++;
            continue;
        }

        if (c === '\n') {
            out += '\n';
        } else {
            out += escapeHtml(c);
        }
        i++;
    }

    if (!out.endsWith('\n')) out += '\n';
    return out;
}


function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => deepEqual(v, b[i]));
    }
    if (typeof a === 'object' && a !== null && b !== null) {
        const ka = Object.keys(a), kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        return ka.every(k => deepEqual(a[k], b[k]));
    }
    return false;
}

function formatTime(ts) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'przed chwilą';
    if (min < 60) return `${min} min temu`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} ${hr === 1 ? 'godzinę' : hr < 5 ? 'godziny' : 'godzin'} temu`;
    const days = Math.floor(hr / 24);
    if (days === 1) return 'wczoraj';
    return `${days} dni temu`;
}

