"use client";

import { cn } from "@/utils/cn";
import { forwardRef } from "react";

export const Input = forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={cn(
                    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                    error && "border-error focus:ring-error",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";
