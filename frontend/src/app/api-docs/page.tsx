"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Copy, Check, Terminal, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const curlExample = `curl -X POST http://localhost:5000/transform \\
  -F "image=@photo.jpg" \\
  -F "prompt=resize to 800px, convert to webp, quality 70" \\
  --output result.webp`;

const requestExample = `// JavaScript (fetch)
const formData = new FormData();
formData.append("image", fileInput.files[0]);
formData.append("prompt", "resize to 800px, convert to webp");

const response = await fetch("http://localhost:5000/transform", {
  method: "POST",
  body: formData,
});

// Response is the processed image as binary
const blob = await response.blob();
const url = URL.createObjectURL(blob);

// Metadata available in response headers:
// X-Image-Width, X-Image-Height, X-Image-Format
// X-Image-Size, X-Original-Width, X-Original-Height
// X-Original-Format, X-Original-Size, X-Instructions`;

const responseHeadersExample = `HTTP/1.1 200 OK
Content-Type: image/webp
X-Image-Width: 800
X-Image-Height: 600
X-Image-Format: webp
X-Image-Size: 45230
X-Original-Width: 1920
X-Original-Height: 1440
X-Original-Format: jpeg
X-Original-Size: 234567
X-Instructions: {"resize":{"width":800},"format":"webp","quality":70}`;

const pythonExample = `import requests

url = "http://localhost:5000/transform"

files = {"image": open("photo.jpg", "rb")}
data = {"prompt": "resize to 400px, grayscale, blur"}

response = requests.post(url, files=files, data=data)

with open("result.jpg", "wb") as f:
    f.write(response.content)

print(f"Output: {response.headers['X-Image-Width']}x{response.headers['X-Image-Height']}")`;

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Terminal className="h-3 w-3 mr-1" />
              API Reference
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              PromptImage <span className="gradient-text">API</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Integrate AI-powered image transformations into your applications
              with a single API endpoint.
            </p>
          </motion.div>

          <div className="space-y-10">
            {/* Endpoint */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Endpoint
              </h2>
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="gradient-bg border-0 text-white">POST</Badge>
                  <code className="text-sm font-mono">/transform</code>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Transforms an uploaded image based on a natural language prompt.
                  The prompt is parsed by an AI model into structured instructions,
                  which are then applied using Sharp.
                </p>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Request Body (multipart/form-data)</h4>
                  <div className="rounded-lg border border-border/40 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="text-left px-4 py-2 font-medium">Field</th>
                          <th className="text-left px-4 py-2 font-medium">Type</th>
                          <th className="text-left px-4 py-2 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        <tr>
                          <td className="px-4 py-2 font-mono text-xs">image</td>
                          <td className="px-4 py-2 text-muted-foreground">File</td>
                          <td className="px-4 py-2 text-muted-foreground">
                            Image file (JPEG, PNG, WebP, TIFF, GIF). Max 5MB.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-xs">prompt</td>
                          <td className="px-4 py-2 text-muted-foreground">String</td>
                          <td className="px-4 py-2 text-muted-foreground">
                            Natural language description of the transformation. Max 500 chars.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Supported Operations */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="text-xl font-semibold mb-4">Supported Operations</h2>
              <div className="rounded-xl border border-border/60 bg-card p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { op: "resize", desc: "Resize by width and/or height" },
                    { op: "format", desc: "Convert to jpeg, png, webp, tiff, gif" },
                    { op: "quality", desc: "Compression quality (1–100)" },
                    { op: "blur", desc: "Gaussian blur (0.3–100)" },
                    { op: "rotate", desc: "Rotation in degrees (0–360)" },
                    { op: "grayscale", desc: "Convert to grayscale" },
                    { op: "flip/flop", desc: "Flip vertically or horizontally" },
                    { op: "sharpen", desc: "Sharpen the image" },
                    { op: "negate", desc: "Invert colors" },
                  ].map((item) => (
                    <div key={item.op} className="flex items-start gap-3">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <code className="text-xs font-mono font-semibold">{item.op}</code>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* cURL Example */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Quick Start (cURL)</h2>
              <CodeBlock code={curlExample} language="bash" />
            </motion.section>

            {/* JavaScript Example */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h2 className="text-xl font-semibold mb-4">JavaScript Example</h2>
              <CodeBlock code={requestExample} language="javascript" />
            </motion.section>

            {/* Python Example */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Python Example</h2>
              <CodeBlock code={pythonExample} language="python" />
            </motion.section>

            {/* Response */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <h2 className="text-xl font-semibold mb-4">Response Headers</h2>
              <p className="text-sm text-muted-foreground mb-4">
                The response body contains the processed image as binary data.
                Metadata is returned via custom response headers:
              </p>
              <CodeBlock code={responseHeadersExample} language="http" />
            </motion.section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
