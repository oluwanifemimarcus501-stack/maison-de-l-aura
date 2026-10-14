import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Style Concierge endpoint
app.post('/api/ai/stylist', async (req, res) => {
  try {
    const { occasion, preferences, garmentName } = req.body;
    
    const prompt = `You are the master style concierge at Maison de L'Aura, a luxury Parisian and Milanese fashion house.
A client is asking for expert styling advice.
Occasion: ${occasion || 'Red Carpet Gala'}
Client Preferences: ${preferences || 'Sophisticated, modern minimalist, understated luxury'}
Selected Garment: ${garmentName || 'Signature Cashmere Overcoat & Silk Gown'}

Provide:
1. An editorial styling concept description (2-3 sentences).
2. Recommended accessories (shoes, bag, jewelry).
3. Color palette notes (hex codes or names).
4. A fashion tip from our creative director.

Format the response as clean JSON matching this schema:
{
  "concept": "string",
  "accessories": ["string"],
  "colorPalette": ["string"],
  "directorTip": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error: any) {
    console.error('Stylist API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate styling advice' });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Maison de L'Aura server running on http://localhost:${port}`);
  });
}

startServer();
