"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const suggestions = [
  "Resize to 800px width",
  "Convert to WebP with 70% quality",
  "Add slight blur and grayscale",
  "Rotate 90° and flip horizontal",
  "Make it a thumbnail (200px)",
  "Compress to low quality JPEG",
  "Sharpen and increase contrast",
  "Convert to PNG, resize to 1200x630",
];

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled,
  loading,
}: PromptInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(true);

  return (
    <div className="space-y-3">
      {/* Input area */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder='Describe your transformation... e.g. "resize to 800px, convert to webp"'
          disabled={disabled}
          className="w-full min-h-[100px] rounded-xl border border-border/60 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all disabled:opacity-50"
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/50">
            {value.length}/500
          </span>
        </div>
      </div>

      {/* Generate button */}
      <Button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="w-full rounded-xl h-11 gradient-bg border-0 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:opacity-95 transition-all disabled:opacity-50 disabled:shadow-none"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Generate</span>
          </div>
        )}
      </Button>

      {/* Suggestions */}
      {showSuggestions && !value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Try a suggestion
            </span>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Hide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
                disabled={disabled}
                className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
