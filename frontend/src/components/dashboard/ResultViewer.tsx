"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download,
  RotateCcw,
  Pencil,
  Info,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TransformMeta } from "@/services/api";
import { formatBytes } from "@/services/api";

interface ResultViewerProps {
  originalPreview: string;
  transformedUrl: string;
  meta: TransformMeta;
  onEditAgain: () => void;
  onReset: () => void;
}

export function ResultViewer({
  originalPreview,
  transformedUrl,
  meta,
  onEditAgain,
  onReset,
}: ResultViewerProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
    },
    []
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, handleMove]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = transformedUrl;
    a.download = `promptimage-result.${meta.format || "jpg"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sizeReduction = meta.originalSize > 0
    ? Math.round(((meta.originalSize - meta.size) / meta.originalSize) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Before / After Comparison Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Before / After Comparison
          </h3>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Drag slider to compare</span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative rounded-xl border border-border/60 overflow-hidden cursor-col-resize select-none touch-none bg-muted/20"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
        >
          {/* Transformed (full width, bottom layer) */}
          <img
            src={transformedUrl}
            alt="Transformed"
            className="w-full h-auto max-h-[400px] object-contain"
            draggable={false}
          />

          {/* Original (clipped, top layer) */}
          <img
            src={originalPreview}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            draggable={false}
          />

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-6 items-center justify-center rounded-full bg-white shadow-xl border border-border/20">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-black/60 text-white border-0 text-[10px]">
              Original
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-primary/80 text-white border-0 text-[10px]">
              Transformed
            </Badge>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Dimensions",
            value: `${meta.width} × ${meta.height}`,
            original: `${meta.originalWidth} × ${meta.originalHeight}`,
          },
          {
            label: "Format",
            value: meta.format.toUpperCase(),
            original: meta.originalFormat.toUpperCase(),
          },
          {
            label: "File Size",
            value: formatBytes(meta.size),
            original: formatBytes(meta.originalSize),
          },
          {
            label: "Reduction",
            value: sizeReduction > 0 ? `${sizeReduction}% smaller` : sizeReduction < 0 ? `${Math.abs(sizeReduction)}% larger` : "Same size",
            original: null,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border/60 bg-muted/20 p-3"
          >
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {item.label}
            </div>
            <div className="text-sm font-semibold">{item.value}</div>
            {item.original && (
              <div className="text-[10px] text-muted-foreground mt-0.5">
                was: {item.original}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleDownload}
          className="rounded-xl gradient-bg border-0 text-white shadow-lg shadow-primary/20 hover:opacity-95 flex-1 sm:flex-none"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          onClick={onEditAgain}
          className="rounded-xl flex-1 sm:flex-none"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Again
        </Button>
        <Button
          variant="ghost"
          onClick={onReset}
          className="rounded-xl flex-1 sm:flex-none"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </motion.div>
  );
}
