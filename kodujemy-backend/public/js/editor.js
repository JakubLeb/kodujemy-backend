
function EditorPage({ taskId, setPage, solveTask, savedCode, saveCode, isSolved }) {
    const task = TASKS.find(t => t.id === taskId);
    const [code, setCode] = useState(savedCode || task?.starterCode || '');
    const [tab, setTab] = useState('task');
    const [testResults, setTestResults] = useState([]);
    const [consoleMsgs, setConsoleMsgs] = useState([]);
    const [running, setRunning] = useState(false);
    const [pyodideReady, setPyodideReady] = useState(!!pyodideInstance);
    const [pyodideLoading, setPyodideLoading] = useState(false);
    const codeRef = useRef(code);
    const lineNumbersRef = useRef(null);
    const textareaRef = useRef(null);
    const highlightRef = useRef(null);

    useEffect(() => { codeRef.current = code; }, [code]);

    useEffect(() => {
        if (!task) return;
        const t = setTimeout(() => saveCode(task.id, code), 600);
        return () => clearTimeout(t);
    }, [code, task]);

    useEffect(() => {
        if (pyodideInstance) { setPyodideReady(true); return; }
        setPyodideLoading(true);
        getPyodide().then(() => {
            setPyodideReady(true);
            setPyodideLoading(false);
        }).catch(e => {
            setPyodideLoading(false);
            setConsoleMsgs([{type:'error', text:'Nie udało się załadować środowiska Pythona: ' + e.message}]);
        });
    }, []);

    const onScrollTextarea = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = ta.scrollTop;
        if (highlightRef.current) {
            highlightRef.current.scrollTop = ta.scrollTop;
            highlightRef.current.scrollLeft = ta.scrollLeft;
        }
    };

    const onKeyDownTextarea = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const ta = textareaRef.current;
            const start = ta.selectionStart, end = ta.selectionEnd;
            const newCode = code.substring(0, start) + '    ' + code.substring(end);
            setCode(newCode);
            setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
        }
    };

    if (!task) {
        return (
            <div className="full-page">
                <a className="back-link" onClick={() => setPage({ name: 'tasks' })}>← Wróć do listy zadań</a>
                <div className="empty-state">Zadanie nie istnieje.</div>
            </div>
        );
    }

    const lineNums = Array.from({ length: Math.max(code.split('\n').length, 1) }, (_, i) => i + 1).join('\n');

    const runCode = async (submit = false) => {
        if (!pyodideReady || running) return;
        setRunning(true);
        setConsoleMsgs([{ type: 'info', text: '▶ Uruchamiam testy...' }]);
        setTestResults(task.testCases.map((_, i) => ({ idx: i, status: 'running' })));

        try {
            const py = await getPyodide();
            try {
                py.runPython(`
if '${task.funcName}' in globals():
    del globals()['${task.funcName}']
`);
            } catch {}
            let userError = null;
            try {
                py.runPython(codeRef.current);
            } catch (e) {
                userError = e.message;
            }
            if (userError) {
                setTestResults([]);
                setConsoleMsgs([{ type: 'error', text: 'Błąd w kodzie:\n' + userError }]);
                setRunning(false);
                return;
            }

            let fnExists = false;
            try {
                fnExists = py.runPython(`callable(globals().get('${task.funcName}'))`);
            } catch {}
            if (!fnExists) {
                setTestResults([]);
                setConsoleMsgs([{ type: 'error', text: `Nie zdefiniowano funkcji '${task.funcName}'.` }]);
                setRunning(false);
                return;
            }

            const results = [];
            const consoleOut = [];
            let allPassed = true;
            for (let i = 0; i < task.testCases.length; i++) {
                const tc = task.testCases[i];
                try {
                    const argsExpr = tc.input.map(a => JSON.stringify(a)).join(', ');
                    const callExpr = `${task.funcName}(${argsExpr})`;
                    const rawResult = py.runPython(`import json; json.dumps(${callExpr}, default=str)`);
                    const got = JSON.parse(rawResult);
                    const ok = deepEqual(got, tc.expected);
                    results.push({ idx: i, status: ok ? 'pass' : 'fail', input: tc.input, got, expected: tc.expected });
                    if (!ok) allPassed = false;
                    consoleOut.push({
                        type: ok ? 'pass' : 'fail',
                        text: `Wynik dla ${task.funcName}(${argsExpr}): Zwrócono ${JSON.stringify(got)}${ok ? '' : ` (oczekiwano: ${JSON.stringify(tc.expected)})`}`
                    });
                } catch (e) {
                    allPassed = false;
                    results.push({ idx: i, status: 'fail', input: tc.input, error: e.message, expected: tc.expected });
                    consoleOut.push({ type: 'fail', text: `Wyjątek dla ${task.funcName}(${tc.input.map(a => JSON.stringify(a)).join(', ')}): ${e.message.split('\n').pop()}` });
                }
            }
            setTestResults(results);
            setConsoleMsgs(consoleOut);

            if (submit && allPassed) {
                solveTask(task);
            } else if (submit && !allPassed) {
                setConsoleMsgs([...consoleOut, { type: 'error', text: 'Nie wszystkie testy przeszły. Popraw kod i spróbuj ponownie.' }]);
            }
        } catch (e) {
            setConsoleMsgs([{ type: 'error', text: 'Nieoczekiwany błąd: ' + e.message }]);
        } finally {
            setRunning(false);
        }
    };

    const diffLabel = { easy: 'Łatwy', medium: 'Średni', hard: 'Trudny' };

    return (
        <div className="editor-page">
            <div className="workspace">
                <div className="task-pane">
                    <div className="tabs">
                        <button className={`tab ${tab === 'task' ? 'active' : ''}`} onClick={() => setTab('task')}>Treść zadania</button>
                        <button className={`tab ${tab === 'solution' ? 'active' : ''}`} onClick={() => setTab('solution')}>Rozwiązanie</button>
                    </div>
                    <div className="task-content">
                        <a className="back-link" onClick={() => setPage({ name: 'tasks' })}>← Wszystkie zadania</a>
                        {tab === 'task' && (
                            <>
                                <h1>{task.title}</h1>
                                <div style={{display:'flex', gap:'8px', marginBottom:'18px'}}>
                                    <span className={`difficulty ${task.difficulty}`}>{diffLabel[task.difficulty]}</span>
                                    <span className="task-xp" style={{padding:'4px 10px', background:'#e0e7ff', borderRadius:'12px'}}>+{task.xp} XP</span>
                                </div>
                                {task.description.split('\n').map((p, i) => (
                                    <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/`([^`]+)`/g, '<span class="code-inline">$1</span>') }}></p>
                                ))}
                                {task.examples.map((ex, i) => (
                                    <div className="example-box" key={i}>
                                        <div className="example-header">Przykład {i + 1}</div>
                                        <div className="example-body">
                                            <div className="example-row"><span className="example-label">Wejście:</span><span className="example-val">{ex.input}</span></div>
                                            <div className="example-row"><span className="example-label">Wyjście:</span><span className="example-val code-inline">{ex.output}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {tab === 'solution' && (
                            isSolved && TASK_SOLUTIONS[task.id] ? (
                                <>
                                    <h1 style={{fontSize:'20px'}}>Przykładowe rozwiązanie</h1>
                                    <p>To jedno z możliwych poprawnych rozwiązań. Twój własny kod może wyglądać inaczej — liczy się, że przechodzi wszystkie testy.</p>
                                    <div className="solution-code"
                                        dangerouslySetInnerHTML={{ __html: highlightPython(TASK_SOLUTIONS[task.id]) }} />
                                </>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🔒</div>
                                    <div>Rozwiąż zadanie (zgłoś poprawny kod), aby odblokować przykładowe rozwiązanie.</div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="editor-container">
                    <div className="editor-header">
                        <select className="lang-select" disabled>
                            <option>🐍 Python 3</option>
                        </select>
                        <div className="header-actions">
                            <span className={`header-status ${pyodideLoading ? 'loading' : pyodideReady ? 'ready' : ''}`}>
                                <span className="dot"></span>
                                {pyodideLoading ? 'Ładowanie Pythona...' : pyodideReady ? 'Gotowe' : 'Oczekiwanie...'}
                            </span>
                            <button className="btn-run" onClick={() => runCode(false)} disabled={!pyodideReady || running}>
                                {running ? 'Uruchamiam...' : '▶ Uruchom'}
                            </button>
                            <button className="btn-submit" onClick={() => runCode(true)} disabled={!pyodideReady || running}>
                                Zgłoś rozwiązanie
                            </button>
                        </div>
                    </div>

                    <div className="editor-hint">
                        🐍 Piszesz w <strong style={{margin:'0 4px'}}>Pythonie 3</strong> — uzupełnij funkcję, kliknij <strong style={{margin:'0 4px'}}>▶ Uruchom</strong>, aby sprawdzić testy, a potem <strong style={{margin:'0 4px'}}>Zgłoś rozwiązanie</strong>, by zdobyć XP.
                    </div>

                    <div className="code-area">
                        <div className="line-numbers" ref={lineNumbersRef}>{lineNums}</div>
                        <div className="code-editor-wrap">
                            <pre
                                className="code-highlight"
                                ref={highlightRef}
                                aria-hidden="true"
                                dangerouslySetInnerHTML={{ __html: '<code>' + highlightPython(code) + '</code>' }}
                            />
                            <textarea
                                ref={textareaRef}
                                className="code-textarea"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                onScroll={onScrollTextarea}
                                onKeyDown={onKeyDownTextarea}
                                spellCheck={false}
                                autoCapitalize="off"
                                autoCorrect="off"
                            />
                        </div>
                    </div>

                    <div className="tests-pane">
                        <div className="tests-header">
                            <span className="tests-label">Wyniki Testów</span>
                            {testResults.length === 0
                                ? task.testCases.map((_, i) => <div className="test-pill" key={i}>Test {i + 1}</div>)
                                : testResults.map(r => (
                                    <div key={r.idx} className={`test-pill ${r.status}`}>
                                        Test {r.idx + 1}
                                        {r.status === 'pass' && ' ✓'}
                                        {r.status === 'fail' && ' ✕'}
                                    </div>
                                ))
                            }
                        </div>
                        <div className="console-output">
                            {consoleMsgs.length === 0 ? (
                                <div className="console-empty">Naciśnij ▶ Uruchom, aby przetestować swój kod.</div>
                            ) : consoleMsgs.map((m, i) => (
                                <div className="console-line" key={i}>
                                    {m.type === 'pass' && <span className="icon-pass">✓</span>}
                                    {m.type === 'fail' && <span className="icon-fail">✕</span>}
                                    {m.type === 'info' && <span className="icon-info">▶</span>}
                                    {m.type === 'error' ? (
                                        <span className="console-error">{m.text}</span>
                                    ) : (
                                        <span>{m.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlaygroundPage({ playgroundCode, setPlaygroundCode }) {
    const [code, setCode] = useState(playgroundCode || `# Witaj w edytorze kodu!
# Możesz tu eksperymentować z Pythonem — bez ograniczeń zadania.
# Wynik print() i błędy pojawią się w panelu po prawej.

print("Hello, Kodujemy!")

# Spróbuj czegoś:
for i in range(1, 6):
    print(f"Liczba {i} do kwadratu to {i * i}")
`);
    const [output, setOutput] = useState([]);
    const [running, setRunning] = useState(false);
    const [pyodideReady, setPyodideReady] = useState(!!pyodideInstance);
    const [pyodideLoading, setPyodideLoading] = useState(false);
    const lineNumbersRef = useRef(null);
    const textareaRef = useRef(null);
    const highlightRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setPlaygroundCode(code), 600);
        return () => clearTimeout(t);
    }, [code]);

    useEffect(() => {
        if (pyodideInstance) { setPyodideReady(true); return; }
        setPyodideLoading(true);
        getPyodide().then(() => {
            setPyodideReady(true);
            setPyodideLoading(false);
        }).catch(e => {
            setPyodideLoading(false);
            setOutput([{ type: 'error', text: 'Nie udało się załadować Pythona: ' + e.message }]);
        });
    }, []);

    const onScrollTextarea = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = ta.scrollTop;
        if (highlightRef.current) {
            highlightRef.current.scrollTop = ta.scrollTop;
            highlightRef.current.scrollLeft = ta.scrollLeft;
        }
    };

    const onKeyDownTextarea = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const ta = textareaRef.current;
            const start = ta.selectionStart, end = ta.selectionEnd;
            const newCode = code.substring(0, start) + '    ' + code.substring(end);
            setCode(newCode);
            setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
        }
    };

    const runCode = async () => {
        if (!pyodideReady || running) return;
        setRunning(true);
        setOutput([{ type: 'info', text: '▶ Uruchamiam...' }]);
        try {
            const py = await getPyodide();
            py.runPython(`
import sys, io
_stdout_buf = io.StringIO()
sys.stdout = _stdout_buf
sys.stderr = _stdout_buf
`);
            let runError = null;
            try {
                py.runPython(code);
            } catch (e) {
                runError = e.message;
            }
            const out = py.runPython('_stdout_buf.getvalue()');
            py.runPython('sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__');

            const messages = [];
            if (out && out.trim()) {
                messages.push({ type: 'out', text: out });
            }
            if (runError) {
                messages.push({ type: 'error', text: runError });
            }
            if (messages.length === 0) {
                messages.push({ type: 'info', text: '(Brak wyjścia. Kod wykonał się pomyślnie.)' });
            }
            setOutput(messages);
        } catch (e) {
            setOutput([{ type: 'error', text: 'Nieoczekiwany błąd: ' + e.message }]);
        } finally {
            setRunning(false);
        }
    };

    const clearCode = () => {
        if (confirm('Wyczyścić edytor?')) setCode('');
    };

    const lineNums = Array.from({ length: Math.max(code.split('\n').length, 1) }, (_, i) => i + 1).join('\n');

    return (
        <div className="playground-page">
            <div className="playground-toolbar">
                <div>
                    <h1>💻 Edytor kodu</h1>
                    <p>Swobodny tryb — pisz i uruchamiaj kod Pythona bez ograniczeń zadania.</p>
                </div>
                <div className="header-actions">
                    <span
                        className={`header-status ${pyodideLoading ? 'loading' : pyodideReady ? 'ready' : ''}`}
                        style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }}
                    >
                        <span className="dot"></span>
                        {pyodideLoading ? 'Ładowanie Pythona...' : pyodideReady ? 'Python 3 — Gotowe' : 'Oczekiwanie...'}
                    </span>
                    <button className="filter-btn" onClick={clearCode}>Wyczyść</button>
                    <button className="btn-run" onClick={runCode} disabled={!pyodideReady || running}>
                        {running ? 'Uruchamiam...' : '▶ Uruchom'}
                    </button>
                </div>
            </div>
            <div className="playground-body">
                <div className="playground-editor">
                    <div className="code-area">
                        <div className="line-numbers" ref={lineNumbersRef}>{lineNums}</div>
                        <div className="code-editor-wrap">
                            <pre
                                className="code-highlight"
                                ref={highlightRef}
                                aria-hidden="true"
                                dangerouslySetInnerHTML={{ __html: '<code>' + highlightPython(code) + '</code>' }}
                            />
                            <textarea
                                ref={textareaRef}
                                className="code-textarea"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                onScroll={onScrollTextarea}
                                onKeyDown={onKeyDownTextarea}
                                spellCheck={false}
                                autoCapitalize="off"
                                autoCorrect="off"
                            />
                        </div>
                    </div>
                </div>
                <div className="playground-output">
                    <div className="playground-output-header">Wyjście</div>
                    <div className="console-output">
                        {output.length === 0 ? (
                            <div className="console-empty">Naciśnij ▶ Uruchom, aby wykonać kod.</div>
                        ) : output.map((m, i) => (
                            <div className="console-line" key={i}>
                                {m.type === 'info' && <span className="icon-info">▶</span>}
                                {m.type === 'error' ? (
                                    <span className="console-error">{m.text}</span>
                                ) : m.type === 'out' ? (
                                    <pre style={{margin:0, whiteSpace:'pre-wrap', fontFamily:'inherit'}}>{m.text}</pre>
                                ) : (
                                    <span>{m.text}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

