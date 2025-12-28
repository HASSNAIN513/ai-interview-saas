import { ConfigForm } from "@/components/configuration/ConfigForm";

export default function ConfigurationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuration</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Set up your profile and interview preferences to get the most relevant questions.</p>
            </div>

            <ConfigForm />
        </div>
    );
}
