"use client";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickStart } from "@/components/dashboard/QuickStart";
import { RecentInterviews } from "@/components/dashboard/RecentInterviews";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "interviews"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc") // Assuming 'startedAt' or 'createdAt' exists. SetupForm uses 'startedAt'. 
                    // Wait, SetupForm uses 'startedAt' but let's check index. 
                    // If no index, simple fetching might need client-side sort or simplistic query.
                    // Let's use simple fetching first to avoid index errors in dev.
                );
                // Actually, let's just fetch by userId and sort client side to avoid index creation delay for user.
                const simpleQ = query(collection(db, "interviews"), where("userId", "==", user.uid));

                const querySnapshot = await getDocs(simpleQ);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort client side
                data.sort((a, b) => {
                    const dateA = a.startedAt?.seconds || 0;
                    const dateB = b.startedAt?.seconds || 0;
                    return dateB - dateA;
                });

                setInterviews(data);
            } catch (error) {
                console.error("Error fetching interviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </div>

            <StatsCards interviews={interviews} />
            <QuickStart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-full">
                    {/* Reuse existing RecentInterviews component logic or pass data if we refactor it. 
                        For now, assuming RecentInterviews fetches its own or we can pass it if we update it.
                        The prompt asks to "use real data in the dashboard". RecentInterviews usually fetches.
                        I will check RecentInterviews code next, but for now passing data to Stats and Chart is priority.
                    */}
                    <RecentInterviews interviews={interviews} />
                </div>
                <div className="h-full">
                    <PerformanceChart interviews={interviews} />
                </div>
            </div>
        </div>
    );
}
