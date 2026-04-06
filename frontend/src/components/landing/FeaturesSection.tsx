"use client";

import { motion } from "framer-motion";
import {
  Wand2,
  Zap,
  Code2,
  ImageIcon,
  Palette,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Prompt-Based Editing",
    description:
      "Describe transformations in plain English. Our AI understands resize, blur, format changes, rotation, and more.",
    accent: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Powered by Groq's ultra-fast LLM inference and Sharp's optimized image processing. Results in seconds.",
    accent: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: Code2,
    title: "Developer API",
    description:
      "Simple REST API for programmatic access. Integrate image transformations into your own applications.",
    accent: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-500",
  },
  {
    icon: ImageIcon,
    title: "Multiple Formats",
    description:
      "Support for JPEG, PNG, WebP, TIFF, and GIF. Convert between formats effortlessly with a single prompt.",
    accent: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    icon: Palette,
    title: "Advanced Effects",
    description:
      "Apply blur, sharpen, grayscale, negate, flip, rotate — all through natural language commands.",
    accent: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your images are processed in memory and never stored. No data leaves the processing pipeline.",
    accent: "from-teal-500/20 to-emerald-500/20",
    iconColor: "text-teal-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need for{" "}
            <span className="gradient-text">image transformation</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete toolkit for processing images with AI-powered natural
            language understanding.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} mb-4 transition-transform group-hover:scale-110`}
              >
                <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
