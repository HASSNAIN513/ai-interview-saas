"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function QuickStart() {
    return (
        <div className="mb-8">
            <Card className="bg-gradient-to-r from-primary-600 to-secondary-600 border-none text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

                <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">AI Powered</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Ready to Ace Your Interview?</h2>
                        <p className="text-primary-100 max-w-lg text-lg">
                            Start a new mock interview session tailored to your role. Get instant AI feedback on your answers, tone, and pacing.
                        </p>
                    </div>

                    <Link href="/interview/setup">
                        <Button
                            size="lg"
                            className="bg-white text-primary-600 hover:bg-gray-100 border-none shadow-xl transform transition-transform hover:-translate-y-1"
                        >
                            <Sparkles className="w-5 h-5 mr-2 text-accent-500" />
                            Start New Interview
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
