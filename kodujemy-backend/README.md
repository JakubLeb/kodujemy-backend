# Kodujemy — backend (Netlify Functions + Neon)

Brakujący backend do Twojej aplikacji. Frontend (`public/index.html`) bez tego
pokazywał biały ekran, bo wołał `/api/...`, a tych endpointów nikt nie obsługiwał.
Teraz każda ścieżka `/api/...` ma swoją funkcję serverless, która gada z bazą Neon.

## Struktura

```
.
├── netlify.toml                 # mapowanie /api/* -> funkcje + katalog publish
├── package.json                 # zależność: @neondatabase/serverless
├── public/
│   └── index.html               # Twój frontend (serwowany jako strona)
└── netlify/functions/
    ├── auth-register.js         # POST /api/auth/register
    ├── auth-login.js            # POST /api/auth/login
    ├── auth-session.js          # GET  /api/auth/session
    ├── auth-logout.js           # POST /api/auth/logout
    ├── solve-task.js            # POST /api/solve-task
    ├── complete-lesson.js       # POST /api/complete-lesson
    ├── save-code.js             # POST /api/save-code
    ├── save-playground.js       # POST /api/save-playground
    ├── leaderboard.js           # GET  /api/leaderboard
    └── utils/
        ├── db.js                # połączenie z Neon + tworzenie tabel
        └── helpers.js           # hasła, tokeny, budowanie stanu usera
```

## Krok 1 — Connection string z Neon

1. W panelu Neon otwórz swój projekt → **Connection Details**.
2. Skopiuj **Connection string** (zaczyna się od `postgresql://...`).
   Użyj wersji **pooled** (z `-pooler` w hoście) — lepsza dla funkcji serverless.
3. Upewnij się, że na końcu jest `?sslmode=require`.

> WAŻNE: tego stringa NIGDY nie wklejaj do kodu ani do index.html.
> Trafia wyłącznie do zmiennej środowiskowej (krok 3).

## Krok 2 — Wgranie na Netlify

Masz dwie drogi.

### A) Przez GitHub (zalecane)
1. Wrzuć całą tę zawartość do repozytorium na GitHubie.
2. W Netlify: **Add new site → Import an existing project →** wskaż repo.
3. Build settings zostaw puste (Netlify odczyta `netlify.toml`):
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
4. Deploy.

### B) Przez Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init        # albo: netlify deploy --build
```

## Krok 3 — Zmienna środowiskowa DATABASE_URL

W Netlify: **Site configuration → Environment variables → Add a variable**

- Key:  `DATABASE_URL`
- Value: `postgresql://...` (connection string z kroku 1)

Po dodaniu zmiennej zrób **Trigger deploy → Deploy site**, żeby funkcje
podchwyciły nową wartość.

## Krok 4 — Pierwsze uruchomienie

Tabele tworzą się **same** przy pierwszym żądaniu (`CREATE TABLE IF NOT EXISTS`),
więc nie musisz ręcznie odpalać żadnego SQL. Wejdź na stronę, zarejestruj konto
i gotowe.

## Jak to działa (w skrócie)

- Hasła hashowane są `scrypt` (wbudowany `crypto`, bez zewnętrznych paczek).
- Sesja = losowy token w tabeli `sessions`; frontend trzyma go w `localStorage`
  i wysyła w nagłówku `Authorization: Bearer <token>`.
- XP nalicza się po stronie serwera; rozwiązanie tego samego zadania drugi raz
  nie daje XP (klucz główny `user_id+task_id` + `ON CONFLICT DO NOTHING`).
- Endpointy zwracają dokładnie taki kształt danych, jakiego oczekuje Twój
  `index.html` (m.in. `{ token, user, activity, savedCodes }` przy logowaniu).

## Najczęstsze problemy

- **Dalej biały ekran / błędy 500** → sprawdź, czy `DATABASE_URL` jest ustawiony
  i czy po jego dodaniu był nowy deploy. Bez tej zmiennej funkcje nie wstaną.
- **404 na /api/...** → upewnij się, że `netlify.toml` jest w katalogu głównym
  repo (nie w podfolderze) i że katalog `netlify/functions` istnieje.
- **Błąd SSL / połączenia z Neon** → dodaj `?sslmode=require` na końcu stringa
  i używaj hosta z `-pooler`.
- **Lokalne testy** → `netlify dev` postawi front i funkcje razem na localhost,
  ale i tak potrzebuje `DATABASE_URL` (np. w pliku `.env`).
```
DATABASE_URL=postgresql://...
```
