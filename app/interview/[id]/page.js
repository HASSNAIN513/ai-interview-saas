"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { AudioRecorder } from "@/components/interview/AudioRecorder";
import { FeedbackCard } from "@/components/interview/FeedbackCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, StopCircle } from "lucide-react";

export default function InterviewSessionPage() {
    const { id } = useParams();
    const router = useRouter();
    const [interview, setInterview] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessionFull, setSessionFull] = useState(loading); // Initial fetch loading

    // Fetch Session Data
    useEffect(() => {
        const fetchSession = async () => {
            setSessionFull(true);
            if (!id) return;
            try {
                const docRef = doc(db, "interviews", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setInterview(data);
                    // Set current question (assuming last one in array is current if running)
                    const questions = data.questions || [];
                    if (questions.length > 0) {
                        setCurrentQuestion(questions[questions.length - 1].text);
                    }
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setSessionFull(false);
            }
        };
        fetchSession();
    }, [id]);

    const handleSubmitAnswer = async () => {
        if (!transcript) return;
        setLoading(true);
        try {
            const token = await auth.currentUser.getIdToken();
            // 1. Get Feedback
            const res = await fetch("/api/ai/submit-answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: currentQuestion,
                    answer: transcript,
                    role: interview.role,
                    level: interview.level,
                    candidateName: interview.candidateName,
                    speakingStyle: interview.speakingStyle,
                    interviewMode: interview.interviewMode
                })
            });
            const evalData = await res.json();
            setFeedback(evalData);

            // 2. Save result to Firestore
            const updatedQuestions = [...interview.questions];
            const currentQIndex = updatedQuestions.length - 1;
            updatedQuestions[currentQIndex] = {
                ...updatedQuestions[currentQIndex],
                transcript: transcript,
                score: evalData.score,
                feedback: evalData.feedback
            };

            const docRef = doc(db, "interviews", id);
            await updateDoc(docRef, {
                questions: updatedQuestions,
                overallScore: (interview.overallScore * (updatedQuestions.length - 1) + evalData.score) / updatedQuestions.length
            });

            // CRITICAL FIX: Update local state so subsequent saves don't overwrite history
            setInterview(prev => ({
                ...prev,
                questions: updatedQuestions,
                overallScore: (prev.overallScore * (updatedQuestions.length - 1) + evalData.score) / updatedQuestions.length
            }));

        } catch (err) {
            console.error("Submit Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNextQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setTranscript("");
        try {
            if (interview.questions.length >= 10) {
                router.push(`/interview/${id}/result`);
                return;
            }

            // Generate Next
            const token = await auth.currentUser.getIdToken();
            const res = await fetch("/api/ai/next-question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: interview.role,
                    level: interview.level,
                    previousQuestions: interview.questions.map(q => q.text),
                    candidateName: interview.candidateName,
                    speakingStyle: interview.speakingStyle,
                    interviewMode: interview.interviewMode,
                    contextResume: interview.contextResume
                })
            });
            const { question } = await res.json();
            setCurrentQuestion(question);

            // Add to Firestore
            const newQuestionObj = {
                id: `q${interview.questions.length + 1}`,
                text: question,
                createdAt: new Date().toISOString(),
            };

            const docRef = doc(db, "interviews", id);
            await updateDoc(docRef, {
                questions: arrayUnion(newQuestionObj)
            });

            // Update local
            setInterview(prev => ({
                ...prev,
                questions: [...prev.questions, newQuestionObj]
            }));

        } catch (err) {
            console.error("Next Question Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = () => {
        router.push(`/dashboard`);
    };

    if (!interview || sessionFull) return <div className="p-10 text-center">Loading Session...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-10 mt-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-sm font-semibold text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                        Question {interview.questions.length} / 10
                    </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleEndSession} className="text-red-500 border-red-200 hover:bg-red-50">
                    End Session
                </Button>
            </div>

            {/* Question */}
            {/* Question */}
            <QuestionCard
                question={currentQuestion}
                speakingStyle={interview.speakingStyle}
                voiceName={interview.aiVoice}
            />

            {/* Feedback or Recorder */}
            {feedback ? (
                <div className="space-y-6">
                    <FeedbackCard feedback={feedback.feedback} score={feedback.score} />
                    <div className="flex justify-end pt-4">
                        <Button size="lg" onClick={handleNextQuestion} loading={loading}>
                            Next Question <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Answer Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Your Answer</h4>
                        <AudioRecorder onTranscriptChange={setTranscript} />
                    </div>

                    <div className="flex justify-center pt-2">
                        <Button
                            size="lg"
                            onClick={handleSubmitAnswer}
                            disabled={!transcript || loading}
                            loading={loading}
                            className="w-full md:w-1/2"
                        >
                            Submit Answer
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
