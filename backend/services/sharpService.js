const sharp = require("sharp");

/**
 * Applies Sharp transformations based on parsed instructions.
 * @param {Buffer} imageBuffer - raw image bytes
 * @param {Object} instructions - sanitized transformation instructions
 * @returns {{ buffer: Buffer, info: Object }} processed image + metadata
 */
async function transformImage(imageBuffer, instructions) {
  let pipeline = sharp(imageBuffer);

  // Get original metadata for the response
  const originalMeta = await sharp(imageBuffer).metadata();

  // 1. Rotate (before resize so dimensions make sense)
  if (instructions.rotate) {
    pipeline = pipeline.rotate(instructions.rotate);
  }

  // 2. Flip / Flop
  if (instructions.flip) {
    pipeline = pipeline.flip();
  }
  if (instructions.flop) {
    pipeline = pipeline.flop();
  }

  // 3. Resize
  if (instructions.resize) {
    pipeline = pipeline.resize({
      width: instructions.resize.width || undefined,
      height: instructions.resize.height || undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // 4. Grayscale
  if (instructions.grayscale) {
    pipeline = pipeline.grayscale();
  }

  // 5. Blur
  if (instructions.blur) {
    pipeline = pipeline.blur(instructions.blur);
  }

  // 6. Sharpen
  if (instructions.sharpen) {
    if (typeof instructions.sharpen === "number") {
      pipeline = pipeline.sharpen(instructions.sharpen);
    } else {
      pipeline = pipeline.sharpen();
    }
  }

  // 7. Negate
  if (instructions.negate) {
    pipeline = pipeline.negate();
  }

  // 8. Format + Quality
  const outputFormat = instructions.format || originalMeta.format || "jpeg";
  const formatOptions = {};

  if (instructions.quality) {
    formatOptions.quality = instructions.quality;
  }

  pipeline = pipeline.toFormat(outputFormat, formatOptions);

  // Execute
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    info: {
      format: info.format,
      width: info.width,
      height: info.height,
      size: info.size,
      originalWidth: originalMeta.width,
      originalHeight: originalMeta.height,
      originalFormat: originalMeta.format,
      originalSize: imageBuffer.length,
    },
  };
}

module.exports = { transformImage };
