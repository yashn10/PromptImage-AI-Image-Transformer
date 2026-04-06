"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, X, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  file: File | null;
  preview: string | null;
  onFileSelect: (file: File, preview: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUploader({
  file,
  preview,
  onFileSelect,
  onClear,
  disabled,
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const err = fileRejections[0].errors[0];
        if (err.message.includes("larger")) {
          setError("File is too large. Maximum size is 5MB.");
        } else {
          setError("Invalid file type. Please upload an image.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        const url = URL.createObjectURL(f);
        onFileSelect(f, url);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/tiff": [".tiff", ".tif"],
      "image/gif": [".gif"],
    },
    maxSize: MAX_SIZE,
    multiple: false,
    disabled,
  });

  if (preview && file) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <div className="relative rounded-xl border border-border/60 overflow-hidden bg-muted/30">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-[300px] object-contain mx-auto"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="rounded-lg"
              disabled={disabled}
            >
              <X className="h-4 w-4 mr-1.5" />
              Remove
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="truncate">{file.name}</span>
          <span className="shrink-0">
            ({(file.size / 1024).toFixed(0)} KB)
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 sm:p-12 cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"
        >
          <Upload className="h-6 w-6 text-primary" />
        </motion.div>

        <div className="text-center">
          <p className="text-sm font-medium">
            {isDragActive ? "Drop your image here" : "Drag & drop your image here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse • JPEG, PNG, WebP, TIFF, GIF • Max 5MB
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex items-center gap-2 text-sm text-destructive"
          >
            <FileWarning className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
