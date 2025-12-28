"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "lucide-react"; // Wait, Lucide doesn't have Badge component, it has BadgeIcon or I should make my own Badge UI.
import { ArrowRight } from "lucide-react";

import Link from "next/link";

export function RecentInterviews({ interviews = [] }) {
    const recent = interviews.slice(0, 5); // Show top 5 recent

    if (recent.length === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sessions</h3>
                <div className="text-sm text-gray-500">No recent interviews found.</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sessions</h3>
                <Link href="/dashboard/history" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">View All</Link>
            </div>

            <div className="space-y-3">
                {recent.map((interview) => (
                    <Link href={`/interview/${interview.id}/result`} key={interview.id}>
                        <Card className="p-4 flex items-center justify-between hover:border-primary-200 dark:hover:border-primary-900 transition-colors cursor-pointer group mb-3">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">{interview.role}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                        {interview.createdAt?.seconds
                                            ? new Date(interview.createdAt.seconds * 1000).toLocaleDateString()
                                            : "Just now"}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{interview.type}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`text-lg font-bold ${interview.overallScore >= 80 ? "text-green-500" : interview.overallScore >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                                    {interview.overallScore > 0 ? `${interview.overallScore}%` : "-"}
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
