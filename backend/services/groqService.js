const Groq = require("groq-sdk");
const { sanitizeInstructions, DEFAULT_INSTRUCTIONS } = require("../utils/validators");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an image processing assistant. Convert the user's natural language image editing request into a JSON object.

Supported operations:
- resize: { width?: number, height?: number } — resize the image (pixels)
- format: "jpeg" | "png" | "webp" | "tiff" | "gif" — output format
- quality: number (1-100) — compression quality
- blur: number (0.3-100) — Gaussian blur sigma
- rotate: number (0-360) — rotation in degrees
- grayscale: boolean — convert to grayscale
- flip: boolean — flip vertically
- flop: boolean — flip horizontally
- negate: boolean — invert colors
- sharpen: boolean | number — sharpen the image

RULES:
1. Return ONLY valid JSON, no markdown, no explanations.
2. Only include operations the user explicitly or implicitly requests.
3. Use reasonable defaults when the user is vague (e.g., "make it smaller" → resize to 800px width).
4. If the user says "compress" or "optimize", reduce quality to 60-70.
5. "thumbnail" means resize to ~200px width.

Example input: "resize to 800px wide, convert to webp, low quality"
Example output: {"resize":{"width":800},"format":"webp","quality":40}`;

/**
 * Sends the user prompt to Groq and returns parsed JSON instructions.
 * Retries once on invalid JSON.
 */
async function parsePrompt(prompt, retryCount = 0) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Groq");
    }

    // Try to parse the JSON
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Invalid JSON in response");
      }
    }

    return sanitizeInstructions(parsed);
  } catch (err) {
    console.error(`Groq parse attempt ${retryCount + 1} failed:`, err.message);

    // Retry once
    if (retryCount < 1) {
      console.log("Retrying prompt parsing...");
      return parsePrompt(prompt, retryCount + 1);
    }

    // Fall back to defaults
    console.warn("Using default instructions after retry failure");
    return { ...DEFAULT_INSTRUCTIONS };
  }
}

module.exports = { parsePrompt };
