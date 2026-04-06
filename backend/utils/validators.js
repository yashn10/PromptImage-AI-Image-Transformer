/**
 * Validates and sanitizes the parsed instructions from Groq.
 * Clamps values to safe ranges and strips unknown keys.
 */

const SUPPORTED_FORMATS = ["jpeg", "jpg", "png", "webp", "tiff", "gif"];

const DEFAULT_INSTRUCTIONS = {
  format: "jpeg",
  quality: 80,
};

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function sanitizeInstructions(raw) {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_INSTRUCTIONS };
  }

  const result = {};

  // Resize
  if (raw.resize && typeof raw.resize === "object") {
    result.resize = {};
    if (raw.resize.width && typeof raw.resize.width === "number") {
      result.resize.width = clamp(Math.round(raw.resize.width), 1, 10000);
    }
    if (raw.resize.height && typeof raw.resize.height === "number") {
      result.resize.height = clamp(Math.round(raw.resize.height), 1, 10000);
    }
    // Only keep resize if at least one dimension is set
    if (!result.resize.width && !result.resize.height) {
      delete result.resize;
    }
  }

  // Format
  if (raw.format && typeof raw.format === "string") {
    const fmt = raw.format.toLowerCase().trim();
    if (SUPPORTED_FORMATS.includes(fmt)) {
      result.format = fmt === "jpg" ? "jpeg" : fmt;
    }
  }

  // Quality
  if (raw.quality !== undefined && typeof raw.quality === "number") {
    result.quality = clamp(Math.round(raw.quality), 1, 100);
  }

  // Blur
  if (raw.blur !== undefined && typeof raw.blur === "number") {
    result.blur = clamp(raw.blur, 0.3, 100);
  }

  // Rotate
  if (raw.rotate !== undefined && typeof raw.rotate === "number") {
    result.rotate = Math.round(raw.rotate) % 360;
  }

  // Grayscale
  if (raw.grayscale === true || raw.greyscale === true) {
    result.grayscale = true;
  }

  // Flip / Flop
  if (raw.flip === true) result.flip = true;
  if (raw.flop === true) result.flop = true;

  // Negate
  if (raw.negate === true) result.negate = true;

  // Sharpen
  if (raw.sharpen === true || (typeof raw.sharpen === "number" && raw.sharpen > 0)) {
    result.sharpen = typeof raw.sharpen === "number" ? clamp(raw.sharpen, 0.5, 10) : true;
  }

  return result;
}

module.exports = { sanitizeInstructions, DEFAULT_INSTRUCTIONS };
