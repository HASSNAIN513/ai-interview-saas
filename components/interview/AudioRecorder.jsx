"use client";

// import 'regenerator-runtime/runtime';
import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/Button";
import { Mic, Square, RefreshCw } from "lucide-react";

export function AudioRecorder({ onTranscriptChange }) {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        onTranscriptChange(transcript);
    }, [transcript, onTranscriptChange]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn&apos;t support speech recognition.</span>;
    }

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            // Stop AI speaking when user starts recording
            window.speechSynthesis.cancel();
            SpeechRecognition.startListening({ continuous: true });
        }
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
                <Button variant="outline" onClick={resetTranscript} disabled={listening}>
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[100px] text-gray-700 dark:text-gray-300">
                {transcript || <span className="text-gray-400 italic">Your answer will appear here...</span>}
            </div>
        </div>
    );
}
