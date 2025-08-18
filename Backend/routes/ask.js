import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.6,    // balanced + consistent
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 512
    }
  });
}

// Persona + few-shots tuned for Innovation Management
const SYSTEM = `
You are UbuntuTutor, an encouraging AI teaching assistant for Belgium Campus' Intro to Innovation Management.
Rules:
- Keep answers under 120 words.
- When explaining a framework (e.g., Stage-Gate, Business Model Canvas), list steps and add one short real-world example.
- For templates, output clear bullet headings only.
- If a question is outside Innovation Management, reply: "I specialize in Innovation Management—how can I help with that?"
`;

const FEWSHOTS = `
Q: What's the difference between incremental and radical innovation?
A: • Incremental: small improvements to existing offerings (e.g., yearly camera upgrades).
   • Radical: step-change that redefines value networks (e.g., digital cameras replacing film).

Q: Provide a mini Business Model Canvas template.
A: • Customer Segments • Value Propositions • Channels • Customer Relationships • Revenue Streams
   • Key Resources • Key Activities • Key Partnerships • Cost Structure
`;

function buildPrompt({ question, history }) {
  const recent = (history ?? [])
    .slice(-3)
    .map((h, i) => `Q${i + 1}: ${h.q}\nA${i + 1}: ${h.a}`)
    .join('\n');

  return `${SYSTEM}\n${FEWSHOTS}\n\nPrevious Q&A (if any):\n${recent || 'None'}\n\nStudent: ${question}\nAssistant:`;
}

router.post('/', async (req, res) => {
  try {
    const { question, history } = req.body ?? {};
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Missing "question" (string).' });
    }

    const prompt = buildPrompt({ question: question.trim(), history });
    const model = getModel();

    // Simple text prompting (no tools) for reliability
    const result = await model.generateContent(prompt);
    const text = (result?.response?.text?.() || '').trim();

    if (!text) return res.status(502).json({ error: 'Empty response from model.' });
    return res.json({ answer: text, model: modelName });
  } catch (err) {
    console.error('[ASK]', err?.message || err);
    const status = err?.status || 500;
    return res.status(status).json({ error: 'AI call failed. Try again in a moment.' });
  }
});

export default router;
