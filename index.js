// index.js
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(express.json());

const MODEL = process.env.AI_MODEL || "gpt-4o-mini";
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🤖 WhatsApp Chatbot API is running!");
});

// 🧠 Chat route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, user } = req.body;

    if (!message)
      return res.status(400).json({ error: "Message is required" });

    // Send request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a friendly chatbot for WhatsApp. Keep replies short and natural." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error });

    const reply = data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Chatbot API running on port ${PORT}`)
);
