# UbuntuTutor — Innovation Management AI Teaching Assistant

UbuntuTutor is a lightweight, course-specific AI assistant for **Innovation Management** at Belgium Campus.  
It explains key concepts (e.g., *incremental vs radical innovation*), walks through frameworks (e.g., *Stage-Gate*, *Business Model Canvas*), and provides short real-world examples — all in a clean, modern web UI.

Built with **Google AI Studio (Gemini)** + **Node/Express** + **Tailwind**.


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

---

## ✨ Features

- **Focused Persona**: concise, encouraging TA tuned to Innovation Management
- **Framework Walk-throughs**: lists steps + 1 short real example
- **Mini Templates**: one-click BMC headings, etc.
- **Modern UI**: Tailwind (red/black/blue theme), example chips, keyboard shortcuts
- **Copy to Clipboard**: quickly copy any answer
- **Session Memory**: keeps last 3 Q&A in context + persists chat in `localStorage`
- **Guardrails**: polite off-topic response (keeps the scope academic)
- **Health Check**: `GET /health` to verify server & model
- **(Optional) Model Fallback**: prefer `gemini-1.5-pro`, auto-fallback to `gemini-1.5-flash` on 429s

---

## 🧱 Tech Stack

- **AI**: Google AI Studio (Gemini 1.5) via `@google/generative-ai`
- **Backend**: Node.js, Express, CORS, dotenv
- **Frontend**: HTML, Tailwind (CDN), vanilla JS
- **Editor**: VS Code workspace with shared `.vscode` settings

---

## 🧭 How it works (flow)

1. User asks a question in the web UI.
2. Frontend `POST /ask` → backend merges last 3 Q&A into a short context prompt.
3. Backend calls **Gemini** with the UbuntuTutor system prompt (+ optional few-shots).
4. JSON `{ answer }` returns → UI renders an answer card (copyable).
5. Last Q&A is stored in memory (and `localStorage`) for continuity.

---

## 📂 Project Structure

> Your repo currently looks like this (good for an MVP):

