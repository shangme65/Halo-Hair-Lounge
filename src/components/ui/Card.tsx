"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({
  children,
  className,
  hover = true,
  gradient = false,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={clsx(
        "rounded-2xl p-6 backdrop-blur-sm",
        gradient
          ? "bg-gradient-to-br from-white/10 to-white/5 border border-white/20"
          : "bg-white/80 dark:bg-dark-800/80 border border-dark-200/50 dark:border-dark-700/50",
        "shadow-xl",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5, shadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}}
    >
      {children}
    </motion.div>
  );
}
