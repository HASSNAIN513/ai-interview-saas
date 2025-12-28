"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/Toast";

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>;
    }

    if (!user) return null; // Prevent flash of content

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex">
                {/* Main content wrapper */}
                <main className="flex-1 md:pl-64 pt-16 min-h-screen w-full transition-all duration-300">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    );
}
