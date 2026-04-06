"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-40 dark:opacity-50"
          priority
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-primary/12 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -left-32 h-[350px] w-[350px] rounded-full bg-chart-2/10 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-chart-5/5 blur-[120px]"
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>AI-Powered Image Transformation</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]"
          >
            Transform Images Using{" "}
            <span className="gradient-text">Simple Prompts</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Upload any image, describe the transformation you want in plain
            English, and get your processed image instantly. No complex tools
            needed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-xl gradient-bg border-0 text-white px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:opacity-95 transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 h-12 text-base backdrop-blur-sm"
              >
                View API Docs
              </Button>
            </Link>
          </motion.div>

          {/* Demo preview — using real image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 w-full max-w-4xl"
          >
            <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-2 shadow-2xl shadow-primary/5 glow">
              <div className="rounded-xl overflow-hidden bg-muted/40 p-4 sm:p-6">
                {/* Prompt bar */}
                <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/80 backdrop-blur-sm p-3 mb-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-bg shadow-md">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    &quot;resize to 800px, convert to webp, add slight blur&quot;
                  </span>
                  <div className="ml-auto">
                    <div className="h-7 px-3 rounded-lg gradient-bg flex items-center text-xs font-medium text-white shadow-sm">
                      Generate ✨
                    </div>
                  </div>
                </div>

                {/* Before/After with real image */}
                <div className="relative rounded-lg overflow-hidden border border-border/40">
                  <Image
                    src="/transform-demo.png"
                    alt="Before and After image transformation demo"
                    width={900}
                    height={500}
                    className="w-full h-auto"
                    priority
                  />
                  {/* Labels */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-md bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                      Original
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-md gradient-bg px-2.5 py-1 text-[10px] font-semibold text-white uppercase tracking-wider shadow-lg">
                      Transformed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
