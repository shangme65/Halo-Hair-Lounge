"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface AnimatedButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative overflow-hidden font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed transform-gpu perspective-1000";

    const variants = {
      primary: clsx(
        // Base gradient with multiple color stops for depth
        "bg-gradient-to-b from-primary-400 via-primary-500 via-50% to-primary-700",
        // Complex 3D shadow stack (no top highlight)
        "shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.2),0_8px_0_0_#14532d,0_10px_8px_-2px_rgba(0,0,0,0.4),0_15px_25px_-5px_rgba(0,0,0,0.3)]",
        // Hover state (no top highlight)
        "hover:shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.2),0_6px_0_0_#14532d,0_8px_6px_-2px_rgba(0,0,0,0.4),0_12px_20px_-5px_rgba(0,0,0,0.3)]",
        "hover:translate-y-[2px]",
        // Active/pressed state
        "active:shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.3),0_1px_0_0_#14532d,0_2px_3px_-1px_rgba(0,0,0,0.4)]",
        "active:translate-y-[7px]",
        // Text - no border to avoid visible lines
        "text-white border-0"
      ),
      secondary: clsx(
        "bg-gradient-to-b from-green-600 via-green-700 via-50% to-green-800",
        "shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.15),0_8px_0_0_rgba(156,163,175,1),0_10px_8px_-2px_rgba(0,0,0,0.4),0_15px_25px_-5px_rgba(0,0,0,0.3)]",
        "hover:shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.15),0_6px_0_0_rgba(156,163,175,1),0_8px_6px_-2px_rgba(0,0,0,0.4),0_12px_20px_-5px_rgba(0,0,0,0.3)]",
        "hover:translate-y-[2px]",
        "active:shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.25),0_1px_0_0_rgba(156,163,175,1),0_2px_3px_-1px_rgba(0,0,0,0.4)]",
        "active:translate-y-[7px]",
        "text-white border-0"
      ),
      outline: clsx(
        // Metallic gradient with shine effect (positioned to not show at top)
        "bg-gradient-to-b from-gray-500 via-gray-500 via-40% to-gray-700 bg-clip-padding",
        // Advanced 3D shadow - beveled metallic look with multiple layers (no top highlight)
        "shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.3),inset_2px_0_2px_0_rgba(255,255,255,0.1),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_6px_0_0_#2a2a2a,0_7px_0_0_#1a1a1a,0_8px_0_0_#0f0f0f,0_12px_15px_-3px_rgba(0,0,0,0.5),0_20px_30px_-5px_rgba(0,0,0,0.3)]",
        // Hover state - lift and glow (no top highlight)
        "hover:shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_#2a2a2a,0_5px_0_0_#1a1a1a,0_6px_0_0_#0f0f0f,0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_0_15px_rgba(156,163,175,0.3)]",
        "hover:translate-y-[2px]",
        "hover:brightness-110",
        // Active/pressed state - deep press with inner glow
        "active:shadow-[inset_0_3px_5px_0_rgba(0,0,0,0.4),inset_0_-1px_1px_0_rgba(255,255,255,0.2),0_1px_0_0_#1a1a1a,0_2px_0_0_#0f0f0f,0_3px_5px_-2px_rgba(0,0,0,0.5)]",
        "active:translate-y-[6px]",
        "active:brightness-95",
        // Text and border - no borders to avoid visible lines
        "text-white border-0"
      ),
      ghost: "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950",
    };

    const sizes = {
      sm: "px-5 py-2 text-sm rounded-xl",
      md: "px-7 py-2.5 text-base rounded-xl",
      lg: "px-9 py-3.5 text-lg rounded-2xl",
    };

    return (
      <motion.button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{
          rotateX: -2,
          transition: { duration: 0.15 },
        }}
        whileTap={{
          rotateX: 5,
          transition: { duration: 0.1 },
        }}
        style={{ transformStyle: "preserve-3d" }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </div>
        ) : (
          <>
            {/* Shine/reflection effect */}
            <div className="absolute inset-0 overflow-hidden rounded-inherit">
              <div className="absolute -top-1/2 -left-1/4 w-[150%] h-full bg-gradient-to-br from-white/30 via-white/10 to-transparent rotate-12 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </div>

            {/* Top highlight line */}
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Content */}
            <div
              className="relative z-10 flex items-center justify-center"
              style={{ transform: "translateZ(2px)" }}
            >
              {children}
            </div>

            {/* Bottom inner shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
