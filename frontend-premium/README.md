# AI Interview Coach — separate premium frontend

This folder contains the UI redesign. The original `../frontend`, `../backend`, database schema, and root configuration are preserved.

## Run locally

Keep the existing backend running on `http://localhost:8000`, then run these commands from this folder:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open **http://localhost:5174**. The original frontend remains available at **http://localhost:5173**.

The copied `.env` contains the existing public Supabase settings. Its `VITE_API_URL=http://localhost:5174` sends browser requests through this frontend's Vite `/api` proxy to the existing backend, avoiding backend or CORS configuration changes. Keep Groq and Supabase secret keys in `../backend/.env` only.

Existing accounts work here. Sign in separately because browser sessions are scoped to each origin. Email-confirmation redirects continue to follow your existing Supabase project settings.

## Included screens

- Sign in and sign up, preserving the original Supabase authentication calls.
- Dashboard with actual statistics, recent interviews, and a contextual next step.
- Interview setup with role selection, difficulty, question count, and a configuration summary.
- Focused interview room with the original sequential answer and scoring flow.
- Results, detailed feedback, rubric breakdowns, and suggested answers.
- Searchable interview history with difficulty/status filters, sorting, and confirmed deletion.
- Performance analytics from the existing stats endpoint.
- Appearance settings with light, dark, and system themes; account details and sign out.

The original `/`, `/new`, and `/interview/:id` routes are preserved. Additional frontend presentation routes are `/history`, `/analytics`, and `/settings`.

No mock data is used by the application. Empty states appear until your account has interview data. Appearance is saved locally in the browser. No timer, voice input, answer autosave, new authentication provider, or unsupported backend feature is introduced.

## Validation

```powershell
npm.cmd run build
```

Browser QA uses isolated test fixtures and never creates accounts or changes saved interviews. Original-file hashes are compared after implementation to verify the earlier project was preserved.
