import { SetupForm } from "@/components/interview/SetupForm";
import { Card, CardContent } from "@/components/ui/Card";

export default function InterviewSetupPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gradient mb-4">
                    Setup Your Interview
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Customize your session to match your career goals.
                </p>
            </div>

            <Card className="border-t-4 border-t-primary-500 shadow-2xl dark:shadow-primary-900/20">
                <CardContent className="pt-8 p-8">
                    <SetupForm />
                </CardContent>
            </Card>
        </div>
    );
}
