"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Fixed import path - it was "@/lib/firebase" previously too

export default function SubscriptionPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        // Simulate payment
        setTimeout(async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { isSubscribed: true });
                // Ideally should update local user state or force refresh
                alert("Subscription Activated (Simulated)!");
                window.location.reload();
            } catch (error) {
                console.error("Sub Error", error);
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                    Upgrade to Pro
                </h1>
                <p className="text-gray-500 mt-2">Unlock unlimited AI interviews and advanced analytics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
                <Card className="border-gray-200 dark:border-gray-800">
                    <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <div className="text-3xl font-bold mt-2">$0 <span className="text-base font-normal text-gray-500">/ month</span></div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> 3 AI Mock Interviews</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Basic Feedback</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Standard Questions</li>
                        </ul>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardContent>
                </Card>

                <Card className="border-primary-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">POPULAR</div>
                    <CardHeader>
                        <CardTitle>Pro Plan</CardTitle>
                        <div className="text-3xl font-bold mt-2">$19 <span className="text-base font-normal text-gray-500">/ month</span></div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Unlimited Interviews</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Detailed AI Analytics</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Advanced Role Scenarios</li>
                            <li className="flex items-center gap-2"><Check className="w-5 h-5 text-green-500" /> Priority Support</li>
                        </ul>
                        <Button className="w-full" onClick={handleSubscribe} loading={loading} disabled={user?.isSubscribed}>
                            {user?.isSubscribed ? "Active" : "Subscribe Now"}
                        </Button>
                        <p className="text-xs text-center mt-2 text-gray-400">EasyPaisa Integration Coming Soon</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
