"use client";

import { Card } from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const data = [ ... ] removed

export function PerformanceChart({ interviews = [] }) {
    // Process data: take last 10 interviews, reverse to show chronological order
    const chartData = interviews
        .filter(i => i.overallScore > 0)
        .slice(0, 10)
        .reverse()
        .map((i, idx) => ({
            name: `Session ${idx + 1}`, // Or use date
            score: i.overallScore
        }));

    if (chartData.length === 0) {
        return (
            <Card className="h-full flex items-center justify-center p-6">
                <p className="text-gray-500">No interview data yet. Start your first session!</p>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <div className="p-6 pb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trend</h3>
                <p className="text-sm text-gray-500">Your average score over time</p>
            </div>
            <div className="h-64 w-full p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#4F46E5"
                            strokeWidth={3}
                            dot={{ stroke: '#4F46E5', strokeWidth: 2, r: 4, fill: '#fff' }}
                            activeDot={{ r: 6, fill: '#4F46E5' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
