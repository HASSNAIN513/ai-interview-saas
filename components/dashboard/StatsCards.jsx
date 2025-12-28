"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Mic, CheckCircle, Award } from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";

const statConfig = [ // renamed to config
    { label: "Free Interviews Left", id: "limit", icon: Mic, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Completed Interviews", id: "completed", icon: CheckCircle, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Average Score", id: "score", icon: Award, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
];

export function StatsCards({ interviews = [] }) {
    const { user } = useAuth();

    // Calculate stats
    const completedCount = interviews.filter(i => i.overallScore > 0).length;

    const scores = interviews.map(i => i.overallScore).filter(s => s > 0);
    const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : "--";

    const getStatValue = (id) => {
        if (id === "limit") {
            if (user?.isSubscribed) return "Unlimited";
            return user?.freeInterviewCount ?? 3;
        }
        if (id === "completed") return completedCount;
        if (id === "score") return avgScore;
        return 0;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statConfig.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.label} delay={index * 0.1}>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <div className="mt-1 flex items-baseline">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {getStatValue(stat.id)}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
