const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY'); // Replace with your API key

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are Ubuntututor, an AI teaching assistant for an Innovation Management course. Adopt a professional, approachable, and encouraging tone, like an expert consultant. Provide accurate, concise explanations of innovation concepts, including a definition and a real-world example. Answer only questions related to Innovation Management. Structure responses with a clear explanation followed by an example. If the question is unclear or off-topic, politely redirect the user to ask about Innovation Management topics. User question: ${userMessage}`;
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});