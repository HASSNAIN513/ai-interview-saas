"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Mic, Square, RefreshCw } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { SpeechRecognition as NativeSpeech } from "@capacitor-community/speech-recognition";
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export function AudioRecorder({ onTranscriptChange }) {
    // Platform check
    const isNative = Capacitor.isNativePlatform();

    // Native State
    const [confirmedTranscript, setConfirmedTranscript] = useState("");
    const [partialTranscript, setPartialTranscript] = useState("");
    const [nativeListening, setNativeListening] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Unified State
    const transcript = (confirmedTranscript + " " + partialTranscript).trim();
    const listening = nativeListening;

    // Use a ref to track listening state for the "Keep Alive" loop
    const isActiveRef = useRef(false);

    // Initialize Native Permissions
    useEffect(() => {
        if (isNative) {
            NativeSpeech.requestPermissions().then((result) => {
                setPermissionGranted(result.speechRecognition === "granted");
            }).catch(err => console.error("Permission Error", err));
        }
    }, [isNative]);

    // Cleanup Native Listeners
    useEffect(() => {
        if (isNative) {
            return () => {
                NativeSpeech.removeAllListeners();
            };
        }
    }, [isNative]);

    // Sync Transcript
    useEffect(() => {
        onTranscriptChange(transcript);
    }, [transcript, onTranscriptChange]);

    if (!isNative) {
        return <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm">Voice recording is optimized for the Mobile App. Please use the app for full voice features.</div>;
    }

    const triggerNativeStart = async () => {
        if (!isActiveRef.current) return;

        try {
            await NativeSpeech.start({
                language: "en-US",
                maxResults: 2,
                prompt: "Listening...",
                partialResults: true,
                popup: false,
            });
        } catch (e) {
            console.error("Restart Error:", e);
            // If it's already started, ignore. If it's a real error, reset state
            if (!e.message?.includes("already started")) {
                setNativeListening(false);
                isActiveRef.current = false;
            }
        }
    };

    const startRecording = async () => {
        // Stop AI speaking
        try {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            if (Capacitor.isNativePlatform()) {
                await TextToSpeech.stop().catch(() => { });
            }
        } catch (e) {
            console.error("Error stopping TTS before recording:", e);
        }

        if (isNative) {
            if (!permissionGranted) {
                const result = await NativeSpeech.requestPermissions();
                if (result.speechRecognition !== "granted") return;
                setPermissionGranted(true);
            }

            try {
                setConfirmedTranscript("");
                setPartialTranscript("");
                isActiveRef.current = true;
                setNativeListening(true);

                await NativeSpeech.removeAllListeners();

                // Partial results update the temporary display
                await NativeSpeech.addListener("partialResults", (data) => {
                    if (data.matches && data.matches.length > 0) {
                        setPartialTranscript(data.matches[0]);
                    }
                });

                // Final results are appended to the permanent buffer
                await NativeSpeech.addListener("result", (data) => {
                    if (data.matches && data.matches.length > 0) {
                        const finalSegment = data.matches[0];
                        setConfirmedTranscript(prev => (prev + " " + finalSegment).trim());
                        setPartialTranscript("");

                        // Restart listening if we are still active
                        if (isActiveRef.current) {
                            setTimeout(() => triggerNativeStart(), 100);
                        }
                    }
                });

                // Handle system-forced stops (timeouts)
                await NativeSpeech.addListener("listeningState", (state) => {
                    if (state.status === "stopped" && isActiveRef.current) {
                        // Auto-restart if we haven't clicked manual STOP
                        triggerNativeStart();
                    }
                });

                await triggerNativeStart();
            } catch (e) {
                console.error("Native Speech Initialization Error:", e);
                setNativeListening(false);
                isActiveRef.current = false;
            }
        }
    };

    const stopRecording = async () => {
        isActiveRef.current = false;
        setNativeListening(false);
        if (isNative) {
            try {
                await NativeSpeech.stop();
                setPartialTranscript("");
            } catch (e) {
                console.error("Stop Error:", e);
            }
        }
    };

    const toggleListening = () => {
        if (listening) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const reset = () => {
        setConfirmedTranscript("");
        setPartialTranscript("");
        onTranscriptChange("");
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${listening ? "bg-red-100 animate-pulse ring-4 ring-red-200" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Mic className={`w-10 h-10 ${listening ? "text-red-500" : "text-gray-400"}`} />
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={toggleListening}
                    variant={listening ? "secondary" : "primary"}
                    className={listening ? "bg-red-500 hover:bg-red-600 border-transparent text-white" : ""}
                >
                    {listening ? <><Square className="w-4 h-4 mr-2" /> Stop Recording</> : <><Mic className="w-4 h-4 mr-2" /> Start Recording</>}
                </Button>
                <Button variant="outline" onClick={reset} disabled={listening}>
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[100px] text-gray-700 dark:text-gray-300">
                {transcript || <span className="text-gray-400 italic">Your answer will appear here...</span>}
            </div>
        </div>
    );
}
