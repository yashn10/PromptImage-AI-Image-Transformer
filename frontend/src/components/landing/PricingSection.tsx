"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out PromptImage",
    features: [
      "10 transformations / day",
      "5MB max file size",
      "JPEG, PNG, WebP output",
      "Basic operations",
      "Community support",
    ],
    cta: "Get Started",
    href: "/dashboard",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For professionals and power users",
    features: [
      "Unlimited transformations",
      "25MB max file size",
      "All output formats",
      "Advanced operations",
      "API access",
      "Priority support",
      "Batch processing",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "per month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "100MB max file size",
      "Custom API limits",
      "Dedicated support",
      "SLA guarantee",
      "Team management",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "#",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-20 sm:py-28" id="pricing">
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
            Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-6 sm:p-8 transition-all ${
                plan.popular
                  ? "border-primary/50 bg-card shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border/60 bg-card/50 hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full gradient-bg px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-primary/25">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1.5">
                  / {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full rounded-xl h-11 ${
                    plan.popular
                      ? "gradient-bg border-0 text-white shadow-lg shadow-primary/20 hover:opacity-95"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
