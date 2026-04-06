const { parsePrompt } = require("../services/groqService");
const { transformImage } = require("../services/sharpService");

/**
 * POST /transform
 * Accepts: multipart/form-data with "image" file and "prompt" text field
 * Returns: processed image as binary + metadata headers
 */
async function handleTransform(req, res) {
  try {
    // Validate inputs
    if (!req.file) {
      return res.status(400).json({
        error: "No image provided",
        message: "Please upload an image file",
      });
    }

    const prompt = req.body.prompt;
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({
        error: "No prompt provided",
        message: "Please provide a transformation prompt",
      });
    }

    if (prompt.length > 500) {
      return res.status(400).json({
        error: "Prompt too long",
        message: "Prompt must be 500 characters or less",
      });
    }

    console.log(`\n📸 Transform request: "${prompt.trim()}"`);

    // Step 1: Parse prompt with Groq
    console.log("🧠 Parsing prompt with Groq...");
    const instructions = await parsePrompt(prompt.trim());
    console.log("📋 Instructions:", JSON.stringify(instructions));

    // Step 2: Apply Sharp transformations
    console.log("⚙️  Applying transformations...");
    const { buffer, info } = await transformImage(req.file.buffer, instructions);
    console.log(`✅ Done! ${info.originalSize} → ${info.size} bytes`);

    // Step 3: Return processed image
    const mimeMap = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      tiff: "image/tiff",
      gif: "image/gif",
    };

    res.set({
      "Content-Type": mimeMap[info.format] || "image/jpeg",
      "Content-Length": buffer.length,
      "X-Image-Width": info.width,
      "X-Image-Height": info.height,
      "X-Image-Format": info.format,
      "X-Image-Size": info.size,
      "X-Original-Width": info.originalWidth,
      "X-Original-Height": info.originalHeight,
      "X-Original-Format": info.originalFormat,
      "X-Original-Size": info.originalSize,
      "X-Instructions": JSON.stringify(instructions),
      "Access-Control-Expose-Headers":
        "X-Image-Width, X-Image-Height, X-Image-Format, X-Image-Size, X-Original-Width, X-Original-Height, X-Original-Format, X-Original-Size, X-Instructions",
    });

    res.send(buffer);
  } catch (err) {
    console.error("Transform error:", err);
    res.status(500).json({
      error: "Transform failed",
      message: err.message || "Failed to process image",
    });
  }
}

module.exports = { handleTransform };
