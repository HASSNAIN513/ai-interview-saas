"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Volume2,
    Settings,
    UploadCloud,
    Play,
    Save,
    Coffee,
    Scale,
    ShieldAlert,
    Check
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const configSchema = z.object({
    candidateName: z.string().min(2, "Name must be at least 2 characters"),
    targetRole: z.string().min(2, "Target job role is required"),
    experienceLevel: z.string().min(1, "Experience level is required"),
    aiVoice: z.string().min(1, "Interviewer voice is required"),
    speakingStyle: z.enum(["Professional", "Authoritative", "Friendly", "Energetic"]),
    interviewMode: z.enum(["Standard", "Strict Panel", "Casual"]),
    contextResume: z.string().optional(),
});

const SPEAKING_STYLES = ["Professional", "Authoritative", "Friendly", "Energetic"];

const INTERVIEW_MODES = [
    {
        id: "Standard",
        title: "Standard",
        description: "Balanced technical & behavioral mix.",
        icon: Scale,
        color: "text-emerald-500",
        borderColor: "border-emerald-500/50",
        bgColor: "bg-emerald-500/10",
        activeBorder: "border-emerald-500"
    },
    {
        id: "Strict Panel",
        title: "Strict Panel",
        description: "High pressure, deep follow-ups.",
        icon: ShieldAlert,
        color: "text-blue-500",
        borderColor: "border-blue-500/50",
        bgColor: "bg-blue-500/10",
        activeBorder: "border-blue-500"
    },
    {
        id: "Casual",
        title: "Casual",
        description: "Low pressure, conversational.",
        icon: Coffee,
        color: "text-amber-500",
        borderColor: "border-amber-500/50",
        bgColor: "bg-amber-500/10",
        activeBorder: "border-amber-500"
    },
];

export function ConfigForm() {
    const { user, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [voices, setVoices] = useState([]);
    const [isPreviewing, setIsPreviewing] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(configSchema),
        defaultValues: {
            candidateName: user?.displayName || "",
            targetRole: "",
            experienceLevel: "Mid-Level",
            aiVoice: "",
            speakingStyle: "Professional",
            interviewMode: "Standard",
            contextResume: "",
        }
    });

    const selectedStyle = watch("speakingStyle");
    const selectedMode = watch("interviewMode");
    const selectedVoice = watch("aiVoice");

    // Fetch voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                // Filter for English voices only
                const englishVoices = availableVoices.filter(voice =>
                    voice.lang.startsWith("en-") || voice.lang === "en"
                );
                setVoices(englishVoices);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        const fetchConfig = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    reset({
                        candidateName: data.candidateName || user.displayName || "",
                        targetRole: data.targetRole || "",
                        experienceLevel: data.experienceLevel || "Mid-Level",
                        aiVoice: data.aiVoice || "",
                        speakingStyle: data.speakingStyle || "Professional",
                        interviewMode: data.interviewMode || "Standard",
                        contextResume: data.contextResume || "",
                    });
                }
            }
        };
        fetchConfig();
    }, [user, reset]);

    const handlePreviewVoice = useCallback(() => {
        if (!selectedVoice) return;

        setIsPreviewing(true);
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance("Hello! I am your AI interviewer. I will be evaluating your skills today.");
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;

        utterance.onend = () => setIsPreviewing(false);
        window.speechSynthesis.speak(utterance);
    }, [selectedVoice, voices]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Include displayName to sync with Firebase Auth
            await updateUserProfile({
                ...data,
                displayName: data.candidateName
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    {/* Professional Profile */}
                    <Card className="overflow-hidden border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <User className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl">Professional Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate Name</label>
                                <Input placeholder="e.g. Hassnain" error={errors.candidateName?.message} {...register("candidateName")} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Job Role</label>
                                <Input placeholder="e.g. Web Developer" error={errors.targetRole?.message} {...register("targetRole")} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Experience Level</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                                    {...register("experienceLevel")}
                                >
                                    <option value="Entry-Level">Entry-Level</option>
                                    <option value="Mid-Level">Mid-Level</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Voice & Tone */}
                    <Card className="overflow-hidden border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                <Volume2 className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl">AI Voice & Tone</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interviewer Voice</label>
                                <div className="relative group">
                                    <select
                                        className="w-full px-4 pr-14 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none"
                                        {...register("aiVoice")}
                                    >
                                        <option value="">Select a voice...</option>
                                        {voices.map(voice => (
                                            <option key={voice.name} value={voice.name}>
                                                {voice.name} ({voice.lang})
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={handlePreviewVoice}
                                        disabled={!selectedVoice || isPreviewing}
                                        className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50 transition-all text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                                        title="Preview Voice"
                                    >
                                        <Play className={cn("w-4 h-4", isPreviewing && "animate-pulse fill-purple-500 text-purple-500")} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Speaking Style</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SPEAKING_STYLES.map(style => (
                                        <button
                                            key={style}
                                            type="button"
                                            onClick={() => setValue("speakingStyle", style)}
                                            className={cn(
                                                "px-4 py-2.5 rounded-xl border transition-all text-sm font-medium",
                                                selectedStyle === style
                                                    ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20"
                                                    : "border-gray-300 dark:border-gray-700 hover:border-purple-400 text-gray-600 dark:text-gray-300"
                                            )}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Interview Dynamics */}
                    <Card className="overflow-hidden border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                <Settings className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl">Interview Dynamics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Select Mode</label>
                            <div className="space-y-3">
                                {INTERVIEW_MODES.map((mode) => (
                                    <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => setValue("interviewMode", mode.id)}
                                        className={cn(
                                            "w-full flex items-center p-4 rounded-xl border-2 text-left transition-all",
                                            selectedMode === mode.id
                                                ? cn(mode.activeBorder, mode.bgColor)
                                                : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-transparent"
                                        )}
                                    >
                                        <div className={cn("p-2.5 rounded-lg mr-4", mode.bgColor, mode.color)}>
                                            <mode.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900 dark:text-white">{mode.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{mode.description}</div>
                                        </div>
                                        {selectedMode === mode.id && (
                                            <div className={cn("ml-2", mode.color)}>
                                                <Check className="w-5 h-5" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Context & Resume */}
                    <Card className="overflow-hidden border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
                        <CardHeader className="flex flex-row items-center space-x-3 pb-4">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl">Context & Resume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                className="w-full h-48 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-gray-400 text-sm"
                                placeholder="Paste your resume or bio here for better personalized questions..."
                                {...register("contextResume")}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end pt-4 pb-12">
                <Button
                    type="submit"
                    loading={loading}
                    className={cn(
                        "px-8 py-6 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300",
                        success ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {success ? <Check className="w-6 h-6" /> : <Save className="w-6 h-6" />}
                        {success ? "Saved Successfully!" : "Save Configuration"}
                    </div>
                </Button>
            </div>
        </form>
    );
}
