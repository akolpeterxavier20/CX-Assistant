import { readFileSync } from "fs";
import { GoogleGenAI, Type } from "@google/genai";

const instructions = readFileSync(new URL("../prompts/cx-instructions.txt", import.meta.url), "utf8");
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function classifyCustomerMessage({ message, conversation, knowledgeSummary }) {
  // If Gemini API key is not configured, use a lightweight local classifier
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set — using local fallback classifier for development.");
    return localFallbackClassifier({ message, knowledgeSummary });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = buildPrompt({ message, conversation, knowledgeSummary });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            needs_clarification: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            workflow_id: { type: Type.STRING, nullable: true }
          },
          required: ["intent", "confidence", "needs_clarification", "message", "workflow_id"]
        }
      }
    });

    return normalizeClassification(parseJsonSafely(response.text));
  } catch (err) {
    console.error("AI classification failed:", err);
    // On any API error, fall back to the local classifier to keep dev workflow working
    try {
      return localFallbackClassifier({ message, knowledgeSummary });
    } catch (fallbackErr) {
      console.error("Local fallback classifier failed:", fallbackErr);
      throw err;
    }
  }
}

function localFallbackClassifier({ message, knowledgeSummary }) {
  const text = String(message || "").toLowerCase();

  // Check explicit keywords first
  for (const item of knowledgeSummary) {
    if (Array.isArray(item.keywords)) {
      for (const kw of item.keywords) {
        if (!kw) continue;
        const nk = String(kw).toLowerCase();
        if (text.includes(nk)) {
          return normalizeClassification({
            intent: item.intent || "unknown",
            confidence: 0.95,
            needs_clarification: false,
            message: `Sure 🙂 I can help with that.`,
            workflow_id: item.workflow_id || null
          });
        }
      }
    }
  }

  // Heuristic: mentions bike/motorcycle + loan/credit/finance
  const mentionsBike = /\b(bike|motorcycle)\b/.test(text);
  const mentionsLoan = /\b(loan|credit|finance|financing|application|apply)\b/.test(text);
  if (mentionsBike && mentionsLoan) {
    // find first workflow that looks like a bike loan
    const match = knowledgeSummary.find((w) => (w.intent || "").includes("bike") || (w.title || "").toLowerCase().includes("bike"));
    if (match) {
      return normalizeClassification({
        intent: match.intent || "new_bike_loan",
        confidence: 0.9,
        needs_clarification: false,
        message: `Sure 🙂 I can help with that.`,
        workflow_id: match.workflow_id || null
      });
    }
  }

  // Default: ask for clarification
  return normalizeClassification({
    intent: "unknown",
    confidence: 0.4,
    needs_clarification: true,
    message: "Could you tell me a little more about what you need?",
    workflow_id: null
  });
}

function buildPrompt({ message, conversation, knowledgeSummary }) {
  return [
    instructions,
    "",
    "Approved workflows available to CX Assistant:",
    JSON.stringify(knowledgeSummary, null, 2),
    "",
    "Recent conversation:",
    JSON.stringify(conversation, null, 2),
    "",
    "Customer message:",
    message,
    "",
    "Return only JSON. Do not include markdown. Do not include URLs."
  ].join("\n");
}

function parseJsonSafely(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty AI response.");
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI response was not valid JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function normalizeClassification(value) {
  return {
    intent: typeof value.intent === "string" ? value.intent : "unknown",
    confidence: typeof value.confidence === "number" ? Math.max(0, Math.min(1, value.confidence)) : 0,
    needs_clarification: Boolean(value.needs_clarification),
    message: typeof value.message === "string" ? value.message.trim().slice(0, 500) : "",
    workflow_id: typeof value.workflow_id === "string" && value.workflow_id.trim()
      ? value.workflow_id.trim()
      : null
  };
}
