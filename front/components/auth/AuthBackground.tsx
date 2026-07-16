"use client";

import { motion } from "framer-motion";

/**
 * Soft, slowly-drifting gradient blobs behind the glass card -- gives the
 * glassmorphism blur something colorful to actually show through.
 */
export function AuthBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-aluminum-50 via-white to-brown-50"
    >
      <motion.div
        className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brown-200/50 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-aluminum-300/40 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brown-300/30 blur-3xl"
        animate={{ x: [0, 25, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
