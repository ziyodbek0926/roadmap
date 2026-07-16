"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function GlassCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[0_8px_40px_-8px_rgba(120,90,60,0.25)] backdrop-blur-xl sm:p-10"
    >
      {children}
    </motion.div>
  );
}
