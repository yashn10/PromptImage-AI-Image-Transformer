const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface TransformMeta {
  width: number;
  height: number;
  format: string;
  size: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: string;
  originalSize: number;
  instructions: Record<string, unknown>;
}

export interface TransformResult {
  imageUrl: string;
  meta: TransformMeta;
}

export async function transformImage(
  file: File,
  prompt: string
): Promise<TransformResult> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("prompt", prompt);

  const response = await fetch(`${API_BASE}/transform`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    throw new Error(
      errBody?.message || `Transform failed with status ${response.status}`
    );
  }

  // Parse metadata from headers
  const meta: TransformMeta = {
    width: parseInt(response.headers.get("X-Image-Width") || "0"),
    height: parseInt(response.headers.get("X-Image-Height") || "0"),
    format: response.headers.get("X-Image-Format") || "unknown",
    size: parseInt(response.headers.get("X-Image-Size") || "0"),
    originalWidth: parseInt(response.headers.get("X-Original-Width") || "0"),
    originalHeight: parseInt(response.headers.get("X-Original-Height") || "0"),
    originalFormat: response.headers.get("X-Original-Format") || "unknown",
    originalSize: parseInt(response.headers.get("X-Original-Size") || "0"),
    instructions: JSON.parse(
      response.headers.get("X-Instructions") || "{}"
    ),
  };

  const blob = await response.blob();
  const imageUrl = URL.createObjectURL(blob);

  return { imageUrl, meta };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
