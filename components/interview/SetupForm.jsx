"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/components/providers/AuthProvider";

const setupSchema = z.object({
    role: z.string().min(2, "Role is required"),
    level: z.enum(["Entry-Level", "Mid-Level", "Senior", "Expert"]),
    experience: z.number().min(0),
    type: z.enum(["Technical", "Behavioral", "Mixed"]),
    speakingStyle: z.enum(["Professional", "Authoritative", "Friendly", "Energetic"]),
});

export function SetupForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userConfig, setUserConfig] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(setupSchema),
        defaultValues: {
            role: "Software Engineer",
            level: "Mid-Level",
            experience: 2,
            type: "Mixed",
            speakingStyle: "Professional",
        }
    });

    useEffect(() => {
        const fetchUserConfig = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserConfig(data);
                    // Reset form with user's saved config if available
                    reset({
                        role: data.targetRole || data.occupation || "Software Engineer",
                        level: data.experienceLevel || "Mid-Level",
                        experience: data.experienceYears || 2,
                        type: "Mixed",
                        speakingStyle: data.speakingStyle || "Professional",
                    });
                }
            }
        };
        fetchUserConfig();
    }, [user, reset]);

    const onSubmit = async (formData) => {
        // Limit Check
        if (!user.isSubscribed && (user.freeInterviewCount === undefined || user.freeInterviewCount <= 0)) {
            alert("You have used all your free interviews. Please upgrade to Premium for unlimited access.");
            router.push("/dashboard/subscription");
            return;
        }

        setLoading(true);
        try {
            // Combine Form Data with User Config for AI
            const sessionData = {
                ...formData, // This now includes speakingStyle!
                candidateName: userConfig?.candidateName || user?.displayName || "Candidate",
                interviewMode: userConfig?.interviewMode || "Standard",
                aiVoice: userConfig?.aiVoice || "", // Persist selected voice
                contextResume: userConfig?.contextResume || "",
            };

            // Get Auth Token
            const token = await auth.currentUser.getIdToken();

            // 1. Generate first question via API
            const response = await fetch("/api/ai/create-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(sessionData),
            });
            const { question } = await response.json();

            if (!question) throw new Error("Failed to generate question");

            // 2. Create Interview Document in Firestore
            const docRef = await addDoc(collection(db, "interviews"), {
                userId: user.uid,
                ...sessionData,
                questions: [{
                    id: "q1",
                    text: question,
                    createdAt: new Date(),
                }],
                currentQuestionIndex: 0,
                status: "running",
                startedAt: serverTimestamp(),
                overallScore: 0,
            });

            // 3. Decrement Free Count if not subscribed
            if (!user.isSubscribed) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    freeInterviewCount: increment(-1)
                });
            }

            // 4. Redirect
            router.push(`/interview/${docRef.id}`);

        } catch (error) {
            console.error("Setup Error:", error);
            alert("Failed to start interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Target Role" error={errors.role?.message} {...register("role")} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience (Years)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary-500"
                        {...register("experience", { valueAsNumber: true })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary-500" {...register("level")}>
                        <option value="Entry-Level">Entry-Level</option>
                        <option value="Mid-Level">Mid-Level</option>
                        <option value="Senior">Senior</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary-500" {...register("type")}>
                        <option value="Mixed">Mixed</option>
                        <option value="Technical">Technical</option>
                        <option value="Behavioral">Behavioral</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interviewer Persona</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary-500" {...register("speakingStyle")}>
                    <option value="Professional">Professional</option>
                    <option value="Authoritative">Authoritative</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Energetic">Energetic</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Controls the tone and personality of the AI interviewer.</p>
            </div>

            <div className="pt-4">
                <Button type="submit" loading={loading} className="w-full md:w-auto text-lg h-12 shadow-lg shadow-primary-500/20">
                    Generate Interview
                </Button>
            </div>
        </form>
    );
}
