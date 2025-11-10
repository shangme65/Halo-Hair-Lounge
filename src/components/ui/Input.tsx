"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            {label}
          </label>
        )}
        <motion.input
          ref={ref}
          className={clsx(
            "w-full px-4 py-3 rounded-xl",
            "bg-white dark:bg-dark-800",
            "border-2 border-dark-200 dark:border-dark-700",
            "focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20",
            "transition-all duration-200",
            "text-dark-900 dark:text-white",
            "placeholder:text-dark-400",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
