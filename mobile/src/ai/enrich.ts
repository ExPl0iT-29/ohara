export interface EnrichmentResult {
  summary: string;
  topics: string[];
}

const PROMPT = (text: string) =>
  `Summarize this article in 2-3 sentences and list up to 5 topics. Respond as strict JSON: {"summary": string, "topics": string[]}.\n\nArticle:\n${text.slice(0, 8000)}`;

function parseJsonResponse(raw: string): EnrichmentResult | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (typeof parsed.summary === "string" && Array.isArray(parsed.topics)) {
      return { summary: parsed.summary, topics: parsed.topics.map(String) };
    }
  } catch {
    return null;
  }
  return null;
}

async function enrichWithOpenAI(text: string, apiKey: string): Promise<EnrichmentResult | null> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: PROMPT(text) }],
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return parseJsonResponse(data.choices?.[0]?.message?.content ?? "");
}

async function enrichWithGemini(text: string, apiKey: string): Promise<EnrichmentResult | null> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT(text) }] }] }),
    },
  );
  if (!response.ok) return null;
  const data = await response.json();
  return parseJsonResponse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
}

export async function enrichContent(text: string): Promise<EnrichmentResult | null> {
  const provider = process.env.EXPO_PUBLIC_AI_PROVIDER ?? "gemini";
  try {
    if (provider === "openai" && process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      return await enrichWithOpenAI(text, process.env.EXPO_PUBLIC_OPENAI_API_KEY);
    }
    if (provider === "gemini" && process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      return await enrichWithGemini(text, process.env.EXPO_PUBLIC_GEMINI_API_KEY);
    }
  } catch {
    return null;
  }
  return null;
}
