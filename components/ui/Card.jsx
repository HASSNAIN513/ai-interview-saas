"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const Card = ({ children, className, hover = true, delay = 0, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay }}
            whileHover={hover ? { y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" } : {}}
            className={cn(
                "bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader = ({ children, className }) => (
    <div className={cn("p-6 pb-3", className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
    <h3 className={cn("text-xl font-bold text-gray-900 dark:text-white", className)}>{children}</h3>
);

export const CardContent = ({ children, className }) => (
    <div className={cn("p-6 pt-3", className)}>{children}</div>
);
