"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckCircle, AlertCircle, Home, Download } from "lucide-react";
import jsPDF from "jspdf";

export default function InterviewResultPage() {
    const { id } = useParams();
    const router = useRouter();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) return;
            const docRef = doc(db, "interviews", id);
            const snap = await getDoc(docRef);
            if (snap.exists()) setInterview(snap.data());
            setLoading(false);
        };
        fetchResult();
    }, [id]);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(124, 58, 237); // Primary color
        doc.text("Interview Performance Report", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Role: ${interview.role} (${interview.level})`, 20, 35);
        doc.text(`Date: ${new Date(interview.startedAt?.seconds * 1000).toLocaleDateString()}`, 20, 42);
        doc.text(`Overall Score: ${Math.round(interview.overallScore)}%`, 20, 49);

        doc.setLineWidth(0.5);
        doc.line(20, 55, pageWidth - 20, 55);

        let yPos = 65;

        interview.questions?.forEach((q, i) => {
            // Check for page break
            if (yPos > 260) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(0);
            const questionTitle = `Question ${i + 1}:`;
            doc.text(questionTitle, 20, yPos);

            doc.setFontSize(11);
            doc.setTextColor(80);
            const questionText = doc.splitTextToSize(q.text, pageWidth - 40);
            doc.text(questionText, 25, yPos + 7);
            yPos += (questionText.length * 5) + 12;

            doc.setFontSize(11);
            doc.setTextColor(50);
            doc.text("Your Answer:", 25, yPos);
            doc.setFontSize(10);
            doc.setTextColor(100);
            const answerText = doc.splitTextToSize(q.transcript || "No answer provided", pageWidth - 50);
            doc.text(answerText, 30, yPos + 6);
            yPos += (answerText.length * 5) + 10;

            doc.setFontSize(11);
            doc.setTextColor(59, 130, 246); // Blue feedback
            doc.text(`Score: ${q.score}/100`, 25, yPos);
            doc.text("AI Feedback:", 25, yPos + 6);
            doc.setFontSize(10);
            doc.setTextColor(100);
            const feedbackText = doc.splitTextToSize(q.feedback, pageWidth - 50);
            doc.text(feedbackText, 30, yPos + 12);
            yPos += (feedbackText.length * 5) + 25;
        });

        doc.save(`Interview_Report_${interview.role}.pdf`);
    };

    if (loading) return <div className="text-center p-10">Loading Result...</div>;
    if (!interview) return <div className="text-center p-10">Interview not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8 flex flex-col justify-center min-h-screen">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold dark:text-white">Interview Complete!</h1>
                <p className="text-gray-500">Here is how you performed.</p>
            </div>

            <Card className="p-8 text-center bg-white dark:bg-gray-800 border-2 border-primary-100 dark:border-primary-900">
                <div className="text-lg font-medium text-gray-500 mb-2">Overall Score</div>
                <div className={`text-6xl font-bold ${interview.overallScore >= 80 ? "text-green-500" : interview.overallScore >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                    {Math.round(interview.overallScore || 0)}%
                </div>
            </Card>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold dark:text-white">Question Breakdown</h2>
                {interview.questions?.map((q, i) => (
                    <Card key={i} className="p-6 space-y-3">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Question {i + 1}</h3>
                            <span className={`px-2 py-1 rounded text-sm font-bold ${q.score >= 80 ? "bg-green-100 text-green-700" : q.score >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                Score: {q.score}
                            </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 italic">&quot;{q.text}&quot;</p>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm space-y-2">
                            <div>
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Your Answer: </span>
                                <span className="text-gray-800 dark:text-gray-200">{q.transcript}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Feedback: </span>
                                <span className="text-gray-700 dark:text-gray-300">{q.feedback}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <Button size="lg" onClick={handleDownloadPDF} variant="outline" className="border-primary-500 text-primary-600 hover:bg-primary-50">
                    <Download className="w-5 h-5 mr-2" />
                    Download Report (PDF)
                </Button>
                <Button size="lg" onClick={() => router.push('/dashboard')}>
                    <Home className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
}
