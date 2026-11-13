// Vercel serverless function: POST /api/chat  { messages: [{role, content}] } -> { reply }
// Needs env var ANTHROPIC_API_KEY. Optional: CLAUDE_MODEL (default claude-haiku-4-5).
import { SYSTEM_PROMPT } from "../lib/knowledge.js";

const MODEL = process.env.CLAUDE_MODEL || "claude-haiku-4-5";
const MAX_TURNS = 12;      // last N messages sent to the model
const MAX_CHARS = 1500;    // per user message

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: "missing_key" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const raw = Array.isArray(body?.messages) ? body.messages : [];

  const messages = raw
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_TURNS)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "bad_request" });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages
      })
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("Anthropic error", r.status, JSON.stringify(data));
      return res.status(502).json({ error: "upstream" });
    }
    const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    return res.status(200).json({ reply });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: "upstream" });
  }
}
