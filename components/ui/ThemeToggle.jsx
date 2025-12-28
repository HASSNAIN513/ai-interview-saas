"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 90, scale: theme === "dark" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 m-auto flex items-center justify-center"
            >
                <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{ rotate: theme === "light" ? 0 : -90, scale: theme === "light" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
            >
                <Sun className="w-5 h-5 text-yellow-500" />
            </motion.div>
        </button>
    );
}
