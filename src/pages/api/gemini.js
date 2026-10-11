// src/pages/api/gemini.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY is not configured', 
      reply: 'AI Assistant is currently unavailable because the API key is not configured.' 
    });
  }

  const systemInstruction = `
You are the official AI assistant for **CarlinX**, a smart car marketplace web application.

Important facts you must know:
- CarlinX helps users discover, buy, and sell cars as well as car parts and accessories.
- Car Inventory: Users can browse and filter new and used vehicles by condition, brand, model, year, and price on the /inventory page.
- Car Details: Users can view specs, inspect photos, and book test drives directly from vehicle detail pages.
- Parts Shop: Users can search and purchase genuine car spare parts on the /shop page with online payment via Razorpay.
- Selling Cars: Users can list their vehicles for sale on the /sell page by submitting vehicle specs and photos.
- Test Drive Booking: Users can schedule test drives at /testdrive for their chosen brand, model, transmission, city, and preferred date.
- Contact: Customer inquiries can be submitted via /contactus.

Guidelines:
- If someone asks "What is CarlinX?", answer: "CarlinX is a smart car marketplace that helps users discover, compare, and purchase vehicles and parts easily."
- Be friendly, concise, clear, and helpful in every response.
- Maintain full conversation context from prior messages in this session.
`.trim();

  // Format conversation history for Gemini API (limiting to last 12 messages for performance)
  const formattedHistory = [];
  if (Array.isArray(history)) {
    const recentHistory = history.slice(-12);
    for (const item of recentHistory) {
      if (!item || !item.text) continue;
      const role = (item.role === 'ai' || item.role === 'model') ? 'model' : 'user';
      // Gemini contents cannot start with 'model' turn
      if (formattedHistory.length === 0 && role === 'model') continue;
      formattedHistory.push({
        role,
        parts: [{ text: String(item.text) }]
      });
    }
  }

  // Append current user message
  const contents = [
    ...formattedHistory,
    {
      role: 'user',
      parts: [{ text: message.trim() }]
    }
  ];

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const candidateModels = [
    primaryModel,
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-flash-lite-latest'
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            contents
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const reply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply });
      }

      console.warn(`Gemini model ${model} did not succeed:`, data.error?.message || data);
      lastError = data.error?.message || 'Error generating content';
    } catch (err) {
      console.warn(`Error attempting Gemini model ${model}:`, err.message);
      lastError = err.message;
    }
  }

  return res.status(500).json({
    error: lastError || 'Failed to generate response from Gemini',
    reply: 'Sorry, I am having trouble connecting to my AI service right now. Please try again in a moment.'
  });
}

