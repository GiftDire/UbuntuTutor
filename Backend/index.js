import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import askRouter from './routes/ask.js';


const app = express();


app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') ?? '*' }));

// health check
app.get('/health', (_req, res) => res.json({ ok: true, model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' }));

// main route
app.use('/ask', askRouter);

// not found
app.use((req, res) => res.status(404).json({ error: `No route: ${req.method} ${req.path}` }));

// start
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`✅ UbuntuTutor API running at http://localhost:${PORT}`));
