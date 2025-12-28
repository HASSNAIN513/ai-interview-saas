"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation"; // Correct hook for Nextjs 13+

export default function HistoryPage() {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            // Indexing might be required for compound query (userId + startedAt), using client filtering if needed or simple query
            // Simple query: where userId == user.uid
            const q = query(collection(db, "interviews"), where("userId", "==", user.uid));
            // orderBy("startedAt", "desc") requires index.

            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            // Sort client side to avoid index requirement for now
            data.sort((a, b) => (b.startedAt?.seconds || 0) - (a.startedAt?.seconds || 0));
            setInterviews(data);
        };
        fetchHistory();
    }, [user]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">Interview History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview) => (
                    <Card
                        key={interview.id}
                        className="cursor-pointer hover:border-primary-500 transition-colors"
                        onClick={() => router.push(`/interview/${interview.id}/result`)}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{interview.role}</h3>
                                    <p className="text-sm text-gray-500">{interview.level}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${interview.overallScore >= 70 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {Math.round(interview.overallScore)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">
                                {interview.startedAt?.toDate().toLocaleDateString()} at {interview.startedAt?.toDate().toLocaleTimeString()}
                            </p>
                        </div>
                    </Card>
                ))}
                {interviews.length === 0 && <p className="text-gray-500">No interviews yet.</p>}
            </div>
        </div>
    );
}
