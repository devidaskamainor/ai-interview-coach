# AI Interview Coach

Simulated technical interviews: pick a role and difficulty, answer AI-generated questions,
get rubric-based scoring, technical and communication feedback, a model answer, and track progress over time.

**Main application:** the premium UI in `frontend/`, available at **http://localhost:5174**. Run `npm run dev` from the project root to start it. The earlier design is preserved in `frontend-classic/` as an optional backup.

**Stack:** React (Vite) + Tailwind CSS · FastAPI · Groq API · Supabase (Postgres + Auth)

**Prerequisites:** Node.js 22 or newer and Python 3.10 or newer.

## Structure
```
backend/           FastAPI API (LLM calls, scoring, persistence)
frontend/          Main premium React + Tailwind app (port 5174)
frontend-classic/  Preserved earlier design (optional, port 5173)
supabase/          schema.sql (tables + RLS)
```

## 1. Supabase
1. Create a project at https://supabase.com.
2. SQL Editor -> paste and run `supabase/schema.sql`.
3. Authentication -> Providers -> Email. For quick local testing, turn off "Confirm email".
4. Connect -> copy the Project URL. Settings -> API Keys: copy the publishable key (frontend) and secret key (backend only). Legacy `anon` and `service_role` keys also work.

## 2. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                 # fill in the values
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

Create a Groq API key at https://console.groq.com/keys and set these values in `backend/.env`:

```dotenv
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in the same file. Existing `.env` files need the new Groq variables; `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` are no longer used. Restart the backend after changing `.env`.

The default model is listed on Groq's free tier. Keep your account on the Free plan for free usage; request and token quotas apply. Check your account's current limits at https://console.groq.com/settings/limits. Question generation, each submitted answer, and the final summary each make an API request.

On Windows PowerShell, the backend commands are:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
# Edit the existing .env file, or copy .env.example to .env for a new setup.
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

## 3. Frontend

For a fresh clone, create `frontend/.env` using `frontend/.env.example` and fill in the Supabase public URL and publishable key. Keep an existing configured `.env` file. From the project root:

```bash
npm run setup
npm run dev
```
Open **http://localhost:5174**, create an account, and start an interview. `npm run build` builds this same premium frontend. You can also run `npm run dev` directly inside `frontend/`.

The main frontend uses `VITE_API_URL=http://localhost:5174`. Its Vite `/api` proxy forwards requests to the existing backend on port 8000, so no backend or database changes are needed. Keep the backend running in its own terminal.

The earlier design is an optional reference. To run it separately, use `npm run setup:classic` once and `npm run dev:classic`; it opens on port 5173. The default start and build commands always target the premium app.

## Backend checks

From `backend/`, run `python -m unittest discover -s tests -v` (Windows virtual environment: `.\.venv\Scripts\python.exe -m unittest discover -s tests -v`). These tests exercise question generation, scoring, summaries, and Groq failures using an in-memory HTTP transport, without consuming API quota.

## How it works
1. `POST /api/sessions` generates questions (with hidden "ideal points") and stores them.
2. `POST /api/sessions/{id}/questions/{qid}/answer` scores the answer on a 4-part rubric
   (technical accuracy, completeness, clarity, structure). Technical = accuracy + completeness,
   Communication = clarity + structure. Score is 0-100, computed in code, not by the model.
3. `POST /api/sessions/{id}/complete` averages scores and generates a summary with next steps.
4. `GET /api/stats` powers the progress chart, per-role averages and weak topics.

## Security notes
- The service-role key lives only in `backend/.env`. Never expose it in the frontend.
- The backend verifies each Supabase JWT and filters every query by `user_id`.
- Candidate answers are treated as untrusted in the evaluation prompt (prompt-injection guard).
- CORS is limited to `FRONTEND_ORIGIN`.

## Ideas to extend
Timed mode, voice answers (Web Speech API), resume-based questions, rate limiting, deployment (Render/Railway + Vercel).
