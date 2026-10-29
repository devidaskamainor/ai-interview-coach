# AI Interview Coach — earlier design

This folder preserves the earlier UI. The main premium application now lives in `../frontend/` and runs on **http://localhost:5174**.

To start the main app from the project root:

```powershell
npm run dev
```

To run this archived design instead, keep the existing backend on port 8000, configure this folder's `.env` from `.env.example` for a fresh clone, and run from the project root:

```powershell
npm run setup:classic
npm run dev:classic
```

The archived design uses port 5173. Its existing pages, API client, and authentication behavior are preserved.
