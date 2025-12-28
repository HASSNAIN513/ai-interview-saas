"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const Button = ({
    children,
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    onClick,
    ...props
}) => {
    // 1.4 Adaptive Button System - Base Styles
    // Enforcing min-h-[44px] for mobile accessibility (Apple/Google guidelines)
    const baseStyles = `
        min-h-[44px] 
        rounded-lg sm:rounded-xl 
        font-medium 
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:opacity-60 disabled:pointer-events-none 
        flex items-center justify-center gap-2
        select-none
    `;

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg shadow-primary-500/20 active:shadow-none",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-lg shadow-secondary-500/20",
        outline: "border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 focus:ring-primary-500",
        ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
        accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400 shadow-lg shadow-accent-500/20",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/20"
    };

    // 1.4 Adaptive sizing using responsive prefixes
    const sizes = {
        sm: "px-3 sm:px-4 py-2 text-xs sm:text-sm",
        md: "px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base",
        lg: "px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg",
        icon: "p-2 sm:p-3 aspect-square",
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.96 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </motion.button>
    );
};
