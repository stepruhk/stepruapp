# EduBoost AI

Imported from Google AI Studio and prepared to run locally with Vite + React.
OpenAI calls are now proxied through a local Node server so your API key stays server-side.

## Prerequisites

- Node.js 20+
- npm (comes with Node.js)

## Local setup

1. Install dependencies:
   `npm install`
2. Create your local env file:
   `cp .env.example .env.local`
3. Set your OpenAI key in `.env.local`:
   `OPENAI_API_KEY=your_real_key`
4. Set an app password in `.env.local`:
   `APP_PASSWORD=votre_mot_de_passe`
5. Set a professor password in `.env.local`:
   `PROF_PASSWORD=votre_mot_de_passe_prof`
6. Start development (frontend + backend):
   `npm run dev`

## Build

`npm run build`

## Run Production Build

1. Build frontend:
   `npm run build`
2. Start API/static server:
   `npm run start`

## Notes

- Backend endpoints are:
  - `POST /api/summarize`
  - `POST /api/flashcards`
  - `POST /api/podcast`
- The browser never reads the OpenAI key.
- API hardening included:
  - per-IP rate limiting
  - request payload validation
  - normalized error responses (`error.code`, `error.message`, `error.details`, `error.requestId`)
- Optional server tuning via `.env.local`:
  - `RATE_LIMIT_WINDOW_MS`
  - `RATE_LIMIT_MAX_REQUESTS`
  - `MAX_CONTENT_LENGTH`
  - `MAX_PODCAST_TEXT_LENGTH`
  - `SESSION_TTL_MS`
