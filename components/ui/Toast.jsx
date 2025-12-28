"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-gray-900 group-[.toaster]:text-gray-900 dark:group-[.toaster]:text-gray-100 group-[.toaster]:border-gray-200 dark:group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400",
                    actionButton:
                        "group-[.toast]:bg-primary-500 group-[.toast]:text-white",
                    cancelButton:
                        "group-[.toast]:bg-gray-100 dark:group-[.toast]:bg-gray-800 group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400",
                },
            }}
        />
    );
}
