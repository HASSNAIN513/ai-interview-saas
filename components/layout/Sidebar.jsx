"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { LayoutDashboard, History, CreditCard, Settings, Sliders, X } from "lucide-react";
import { useEffect } from "react";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { name: "Configuration", href: "/dashboard/configuration", icon: Sliders },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (isOpen) onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <>
            {/* 1.2 Desktop Sidebar (Persistent) */}
            <aside className="w-64 h-[calc(100vh-4rem)] hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 fixed left-0 top-16 z-30">
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <SidebarContent pathname={pathname} />
                </div>
            </aside>

            {/* 1.2 Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                                <span className="text-xl font-bold text-gradient">Menu</span>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                                <SidebarContent pathname={pathname} />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function SidebarContent({ pathname }) {
    return (
        <>
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative group",
                            isActive
                                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeSidebar"
                                className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </>
    );
}
