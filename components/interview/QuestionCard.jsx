"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Volume2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export function QuestionCard({ question, speakingStyle, voiceName, onPlayAudio }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState([]);

    // Safety sanitization to remove any markdown asterisks provided by AI
    const cleanQuestion = question ? question.replace(/\*/g, "").replace(/\*\*/g, "") : "";

    const getPreferredVoice = useCallback((style, specificVoice) => {
        if (!voices.length) return null;

        const styleMap = {
            "Professional": ["Google US English", "Microsoft David", "English United States"],
            "Friendly": ["Google UK English Female", "Microsoft Zira", "Google US English"],
            "Authoritative": ["Microsoft Mark", "Google US English", "English United Kingdom"],
            "Energetic": ["Google US English", "Microsoft Zira"]
        };

        const preferences = styleMap[style] || styleMap["Professional"];

        if (specificVoice) {
            const exactMatch = voices.find(v => v.name === specificVoice);
            if (exactMatch) return exactMatch;
        }

        for (const pref of preferences) {
            const found = voices.find(v => v.name.includes(pref));
            if (found) return found;
        }

        return voices.find(v => v.lang.startsWith('en')) || voices[0];
    }, [voices]);



    const handlePlay = useCallback(async () => {
        if (!cleanQuestion) return;
        setIsPlaying(true);

        try {
            if (Capacitor.isNativePlatform()) {
                // Native TTS Logic
                try {
                    await TextToSpeech.stop();
                } catch (e) {
                    // Ignore stop errors
                }

                await TextToSpeech.speak({
                    text: cleanQuestion,
                    lang: 'en-US',
                    rate: speakingStyle === "Energetic" ? 1.1 : (speakingStyle === "Authoritative" ? 0.95 : 1.0),
                    pitch: speakingStyle === "Energetic" ? 1.1 : (speakingStyle === "Authoritative" ? 0.9 : 1.0),
                    volume: 1.0,
                    category: 'ambient',
                });
                setIsPlaying(false);
            } else {
                // Web Fallback
                if (typeof window === 'undefined' || !window.speechSynthesis) return;
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(cleanQuestion);
                const selectedVoice = getPreferredVoice(speakingStyle, voiceName);
                if (selectedVoice) utterance.voice = selectedVoice;

                if (speakingStyle === "Energetic") {
                    utterance.rate = 1.1;
                    utterance.pitch = 1.1;
                } else if (speakingStyle === "Authoritative") {
                    utterance.rate = 0.95;
                    utterance.pitch = 0.9;
                } else {
                    utterance.rate = 1;
                    utterance.pitch = 1;
                }

                utterance.onend = () => setIsPlaying(false);
                utterance.onerror = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
            }
        } catch (err) {
            console.error("TTS Error:", err);
            setIsPlaying(false);
        }
    }, [cleanQuestion, speakingStyle, voiceName, getPreferredVoice]);

    useEffect(() => {
        const loadVoices = () => {
            if (typeof window === 'undefined' || !window.speechSynthesis) return;

            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    useEffect(() => {
        if (cleanQuestion && voices.length > 0) {
            const timer = setTimeout(() => {
                handlePlay();
            }, 500);
            return () => {
                clearTimeout(timer);
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
                setIsPlaying(false);
            };
        }
    }, [cleanQuestion, voices.length, handlePlay]);

    return (
        <Card className="border-t-4 border-t-primary-500 shadow-lg">
            <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-primary-500 tracking-wider uppercase">Current Question</h3>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePlay}
                            disabled={isPlaying}
                            className="text-xs"
                        >
                            <Volume2 className="w-4 h-4 mr-2" />
                            {isPlaying ? "Speaking..." : "Replay Question"}
                        </Button>
                    </div>
                </div>

                <motion.p
                    key={cleanQuestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-medium text-gray-900 dark:text-white leading-relaxed"
                >
                    {cleanQuestion}
                </motion.p>
            </div>
        </Card>
    );
}
