// src/pages/api/gemini.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // Inject context about CarlinX before the user's message
  const prompt = `
You are the official AI assistant for **CarlinX**, a smart car marketplace.

Important facts you must know:
- CarlinX helps users buy and sell cars and car parts.
- It provides verified listings, comparisons, vehicle specs, and more.
- The platform makes it easier to discover, compare, and purchase vehicles and parts.

If someone asks "What is CarlinX?", answer:
"CarlinX is a smart car marketplace that helps users discover, compare, and purchase vehicles and parts easily."

Be friendly, clear, and helpful in every response.

User: ${message}
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response from Gemini.';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ reply: 'An error occurred while processing your request.' });
  }
}
