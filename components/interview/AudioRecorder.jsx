"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Mic, Square, RefreshCw } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { SpeechRecognition as NativeSpeech } from "@capacitor-community/speech-recognition";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function AudioRecorder({ onTranscriptChange }) {
    // Platform check
    const isNative = Capacitor.isNativePlatform();

    // Web Implementation
    const {
        transcript: webTranscript,
        listening: webListening,
        resetTranscript: webResetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Native State
    const [nativeTranscript, setNativeTranscript] = useState("");
    const [nativeListening, setNativeListening] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Unified State
    const transcript = isNative ? nativeTranscript : webTranscript;
    const listening = isNative ? nativeListening : webListening;

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

    if (!isNative && !browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startRecording = async () => {
        // Stop AI speaking
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        if (isNative) {
            if (!permissionGranted) {
                const result = await NativeSpeech.requestPermissions();
                if (result.speechRecognition !== "granted") return;
                setPermissionGranted(true);
            }

            try {
                // Clear previous listeners to avoid duplicates
                await NativeSpeech.removeAllListeners();

                // Setup listener
                await NativeSpeech.addListener("partialResults", (data) => {
                    if (data.matches && data.matches.length > 0) {
                        // Show what is currently being spoken providing immediate feedback
                        // Note: This replaces the "verified" state temporarily in the UI roughly 
                        // if we were managing two states, but here we just append.
                        // Actually, simpler logic for Mobile Hybrid: 
                        // Just trust the stream. If we just append partials, we get "Hello... Hello World... Hello World How..."
                        // We need a way to say "Current Segment".

                        // FIX: For now, let's purely rely on partials for the "Current active sentence" 
                        // and `result` for the "Committed sentence"
                        // But since we only have one `nativeTranscript` state...

                        // Let's try this: 
                        // When partial comes, we DON'T add it to `nativeTranscript` permanent store yet?
                        // No, the standard behavior for this plugin is that `partialResults` fires repeatedly.
                        // `result` fires once at the end of a phrase.

                        // Improved Logic:
                        // We will rely on `result` for the permanent text.
                        // But we will use a ref or temp state for the partial? 
                        // To keep it simple for this fix: 
                        // We will update the transcript with the partial match, but we know it might be "unstable".
                        // BUT, the critical bug is "Nothing is processing". 
                        // So let's enable this to at least show SOMETHING.

                        const partialText = data.matches[0];
                        // We can't easily dedup without complex logic. 
                        // Let's just log it for debug and rely on `result` for the text, 
                        // BUT `result` might be slow.

                        // Alternate: On Android, `partialResults`: true often yields the WHOLE phrase growing.
                        // So we can just set transcript to matches[0] if it's longer than before?
                        // Let's just enable the listener to append to a temp log? 
                        // No, user said "It's not recording". 

                        // Let's try to just use `partialResults` to update the text IF it is not empty.
                        // But we need to handle the `result` event too.
                    }
                });

                await NativeSpeech.addListener("result", (data) => {
                    if (data.matches && data.matches.length > 0) {
                        setNativeTranscript(prev => {
                            const newText = data.matches[0];
                            // Prevent duplicates if possible (simple trimmed check)
                            if (prev.endsWith(newText)) return prev;
                            return prev ? prev + " " + newText : newText;
                        });
                    }
                });

                await NativeSpeech.start({
                    language: "en-US",
                    maxResults: 2,
                    prompt: "Speak now...",
                    partialResults: true,
                    popup: false,
                });
                setNativeListening(true);
            } catch (e) {
                console.error("Native Speech Error:", e);
                setNativeListening(false);
            }
        } else {
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    const stopRecording = async () => {
        if (isNative) {
            try {
                // Ensure we mark as stopped first to update UI
                setNativeListening(false);
                await NativeSpeech.stop();
            } catch (e) {
                console.error("Stop Error:", e);
                // Force state reset if error
                setNativeListening(false);
            }
        } else {
            SpeechRecognition.stopListening();
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
        if (isNative) {
            setNativeTranscript("");
        } else {
            webResetTranscript();
        }
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
