"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

// HTMLMotionProps (not the plain React ButtonHTMLAttributes) -- framer-motion
// redefines event handlers like onAnimationStart with its own signatures,
// which otherwise conflict with React's native DOM typings.
interface GooeyButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  isLoading?: boolean;
}

/**
 * "Liquid" submit button: two blobs drift back and forth inside a
 * goo-filtered layer (see GooFilter) so they visually melt into one another
 * instead of just overlapping, then the pill shape clips the result.
 */
export function GooeyButton({ children, isLoading, disabled, className, ...props }: GooeyButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      className={`group relative isolate w-full overflow-hidden rounded-full px-6 py-3 font-medium text-white shadow-lg shadow-brown-500/25 transition-shadow disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
      {...props}
    >
      <span aria-hidden className="absolute inset-0 -z-10 bg-brown-500" style={{ filter: "url(#gooey-btn)" }}>
        <motion.span
          className="absolute -left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-brown-400"
          animate={{ x: ["0%", "120%", "0%"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute left-1/3 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-brown-600"
          animate={{ x: ["0%", "-70%", "0%"], y: ["-50%", "-25%", "-50%"] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>

      <span className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        ) : null}
        {children}
      </span>
    </motion.button>
  );
}
