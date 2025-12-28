"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

export function FeedbackCard({ feedback, score }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
        >
            <Card className={`border-l-4 ${score >= 70 ? "border-l-green-500" : "border-l-yellow-500"} bg-gray-50 dark:bg-gray-800/50`}>
                <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 dark:text-white">AI Feedback</h4>
                        <span className={`text-xl font-bold ${score >= 70 ? "text-green-600" : "text-yellow-600"}`}>
                            Score: {score}/100
                        </span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {feedback}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
