import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Groq client ONCE globally
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey || apiKey === 'your_groq_api_key_here') {
  console.warn("⚠️ Warning: GROQ_API_KEY is not configured in the .env file.");
}
const groq = new Groq({ apiKey: apiKey || 'dummy-key' });

// Compressed safety system prompt to reduce prompt processing latency
const CHAT_SYSTEM_PROMPT = `You are AuraHealth AI, an elite wellness assistant. ONLY answer wellness topics (nutrition, fitness, sleep, symptoms). Refuse unrelated topics politely. If emergency symptoms are described, urge seeking emergency medical care (911/ER) immediately. Disclaimer: "This AI provides general wellness information and is not a substitute for professional medical advice."`;

// Route: Streamed Chat endpoint (SSE)
app.post('/api/chat', async (req, res) => {
  const requestStartTime = Date.now();
  console.log(`[${new Date().toISOString()}] POST /api/chat - Request received.`);

  const { message, history } = req.body;

  if (!message) {
    console.log(`[${new Date().toISOString()}] POST /api/chat - Error: Missing message parameter.`);
    return res.status(400).json({ error: "Message parameter is required." });
  }

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.log(`[${new Date().toISOString()}] POST /api/chat - Error: Missing Groq API Key.`);
    return res.status(500).json({ 
      error: "Groq API Key is not configured in the backend. Please add GROQ_API_KEY to your .env file at the project root." 
    });
  }

  // Format messages starting with safety prompt
  const messages = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT }
  ];

  // Limit message history to last 5 messages to reduce context payload and response latency
  const recentHistory = history && Array.isArray(history) ? history.slice(-5) : [];
  recentHistory.forEach(msg => {
    const role = msg.sender === 'user' ? 'user' : 'assistant';
    messages.push({ role, content: msg.text });
  });

  messages.push({ role: 'user', content: message });

  try {
    // Set headers for Server-Sent Events (SSE) streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Send headers to establish stream link immediately

    const groqCallStartTime = Date.now();
    const stream = await groq.chat.completions.create({
      messages,
      model: "llama-3.1-8b-instant", // Upgraded to the fastest Groq production model
      temperature: 0.3, // Optimized temperature for fast deterministic replies
      max_tokens: 250, // Reduced token limit for rapid completion
      stream: true,
    });

    let totalBytesSent = 0;

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        totalBytesSent += text.length;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

    const requestEndTime = Date.now();
    console.log(`[${new Date().toISOString()}] POST /api/chat - Stream completed.`);
    console.log(` - Groq API duration: ${requestEndTime - groqCallStartTime}ms`);
    console.log(` - Total processing time: ${requestEndTime - requestStartTime}ms`);
    console.log(` - Payload size sent: ${totalBytesSent} characters`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Express /api/chat streaming error:`, error);
    if (!res.headersSent) {
      return res.status(502).json({ 
        error: "We encountered an issue communicating with the AI service. Please verify your API key and try again shortly." 
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || "Stream connection interrupted." })}\n\n`);
      res.end();
    }
  }
});

// Route: Symptom Checker analysis endpoint (fast JSON output)
app.post('/api/analyze-symptoms', async (req, res) => {
  const requestStartTime = Date.now();
  console.log(`[${new Date().toISOString()}] POST /api/analyze-symptoms - Request received.`);

  const { symptoms, category, severity, duration } = req.body;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({ error: "Symptoms array is required." });
  }

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({ 
      error: "Groq API Key is not configured in the backend. Please add GROQ_API_KEY to your .env file at the project root." 
    });
  }

  const symptomsList = symptoms.join(', ');
  const systemInstruction = `
You are an expert diagnostic assistant. Analyze the given symptoms.
Return a structured output in JSON format exactly. Do not wrap the JSON in markdown code blocks.

Schema:
{
  "causes": ["Possible cause 1", "Possible cause 2"],
  "precautions": ["Precaution 1", "Precaution 2"],
  "foodsEat": ["Healthy food 1", "Healthy food 2"],
  "foodsAvoid": ["Food to avoid 1", "Food to avoid 2"],
  "hydration": ["Hydration tip 1", "Hydration tip 2"],
  "activity": ["Activity recommendation 1", "Activity recommendation 2"],
  "consultDoctor": "Guideline explaining when they should consult a physician.",
  "urgency": "low" | "medium" | "high",
  "urgencyReason": "Short scientific statement explaining why this urgency level is selected."
}
`;

  const userPrompt = `
Analyze the following symptoms:
Category: ${category || 'General'}
Symptoms: ${symptomsList}
Severity Level: ${severity || 'Moderate'}
Duration: ${duration || '1-3 days'}
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt }
      ],
      model: "llama-3.1-8b-instant", // Optimized model for symptom analysis too
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const aiText = chatCompletion.choices[0]?.message?.content || "";
    const jsonOutput = JSON.parse(aiText.trim());
    
    const requestEndTime = Date.now();
    console.log(`[${new Date().toISOString()}] POST /api/analyze-symptoms - Complete. Latency: ${requestEndTime - requestStartTime}ms`);
    
    return res.json(jsonOutput);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Express /api/analyze-symptoms error:`, error);
    return res.status(502).json({ 
      error: "We were unable to analyze the symptoms. Please verify your Groq configurations and try again." 
    });
  }
});

// Status check
app.get('/api/health', (req, res) => {
  return res.json({ 
    status: "ok", 
    groqConfigured: !!apiKey && apiKey !== 'your_groq_api_key_here'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AuraHealth AI Backend running on http://localhost:${PORT}`);
});
