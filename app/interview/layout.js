"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InterviewLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">Loading Interface...</div>;

    // Prevent flash if user is null (will redirect)
    if (!user) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <main className="min-h-screen w-full">
                {children}
            </main>
        </div>
    );
}
