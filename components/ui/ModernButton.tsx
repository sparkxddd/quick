"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ModernButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function ModernButton({
    children,
    variant = "primary",
    size = "md",
    className,
    ...props
}: ModernButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {/* Glow effect on hover could go here, keeping it simple but smooth for now */}
            {children}
        </motion.button>
    );
}
