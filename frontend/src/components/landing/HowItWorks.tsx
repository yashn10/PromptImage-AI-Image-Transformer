"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Upload, MessageSquare, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Image",
    description:
      "Drag and drop or browse to upload any image. We support JPEG, PNG, WebP, TIFF, and GIF formats up to 5MB.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Describe Your Edit",
    description:
      'Write a prompt like "resize to 800px, convert to webp, add blur" and our AI will understand exactly what to do.',
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    step: "03",
    icon: Download,
    title: "Download Result",
    description:
      "Preview the transformation side-by-side with the original, then download your processed image instantly.",
    gradient: "from-cyan-500 to-amber-400",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" id="how-it-works">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/features-bg.png"
          alt=""
          fill
          className="object-cover opacity-20 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Three simple steps to{" "}
            <span className="gradient-text">transform any image</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            No complex tools. No learning curve. Just describe what you want.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector arrow (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-12 left-[65%] w-[70%] items-center justify-center">
                  <div className="w-full h-px border-t-2 border-dashed border-primary/20" />
                  <ArrowRight className="h-4 w-4 text-primary/30 shrink-0 -ml-1" />
                </div>
              )}

              <div className="text-center">
                {/* Step number + icon */}
                <div className="relative inline-flex flex-col items-center">
                  <div className="text-xs font-bold text-primary/50 mb-3 tracking-widest">
                    STEP {step.step}
                  </div>
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg shadow-primary/15 mb-6`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
