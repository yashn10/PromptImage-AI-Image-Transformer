"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Menu, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { PromptInput } from "@/components/dashboard/PromptInput";
import { ResultViewer } from "@/components/dashboard/ResultViewer";
import { Navbar } from "@/components/shared/Navbar";
import { transformImage, type TransformResult } from "@/services/api";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransformResult | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const handleFileSelect = useCallback((f: File, p: string) => {
    setFile(f);
    setPreview(p);
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
  }, [preview]);

  const handleSubmit = useCallback(async () => {
    if (!file || !prompt.trim()) {
      toast.error("Please upload an image and enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const res = await transformImage(file, prompt.trim());
      setResult(res);
      toast.success("Image transformed successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to transform image";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [file, prompt]);

  const handleEditAgain = useCallback(() => {
    if (result?.imageUrl) URL.revokeObjectURL(result.imageUrl);
    setResult(null);
    setPrompt("");
  }, [result]);

  const handleReset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    if (result?.imageUrl) URL.revokeObjectURL(result.imageUrl);
    setFile(null);
    setPreview(null);
    setPrompt("");
    setResult(null);
  }, [preview, result]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebar(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[240px] lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="lg:hidden">
          <Navbar />
        </div>

        {/* Desktop top bar */}
        <header className="hidden lg:flex h-16 items-center justify-between border-b border-border/50 px-6">
          <div>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Transform images with AI-powered prompts
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-lg"
            onClick={() => setMobileSidebar(!mobileSidebar)}
          >
            {mobileSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
            <AnimatePresence mode="wait">
              {result && preview ? (
                <ResultViewer
                  key="result"
                  originalPreview={preview}
                  transformedUrl={result.imageUrl}
                  meta={result.meta}
                  onEditAgain={handleEditAgain}
                  onReset={handleReset}
                />
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Upload Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      <h2 className="text-base font-semibold">
                        {file ? "Image Ready" : "Upload Image"}
                      </h2>
                    </div>
                    <ImageUploader
                      file={file}
                      preview={preview}
                      onFileSelect={handleFileSelect}
                      onClear={handleClear}
                      disabled={loading}
                    />
                  </div>

                  {/* Prompt Section */}
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <h2 className="text-base font-semibold">
                        Describe Your Transformation
                      </h2>
                      <PromptInput
                        value={prompt}
                        onChange={setPrompt}
                        onSubmit={handleSubmit}
                        disabled={loading}
                        loading={loading}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
