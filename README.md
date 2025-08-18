# UbuntuTutor – Innovation Management AI TA

**Stack:** Node.js (Express) + Google AI Studio (Gemini) + plain JS frontend (Tailwind CDN).

## Run
1. `cd Backend && cp .env.example .env` → paste your GEMINI_API_KEY  
2. `npm i` then `npm run dev` → http://localhost:3000/health  
3. Open `Front-end/index.html` with *Live Server*.

## Endpoints
- `GET /health`
- `POST /ask` `{ question, history }`

## Notes
- Free tier? Use `gemini-1.5-flash` in `.env`.
- Don’t commit `.env`.
