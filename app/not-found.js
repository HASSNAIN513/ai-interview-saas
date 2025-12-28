import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-center">
            <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800">404</h1>
            <div className="absolute">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
                <Link href="/dashboard">
                    <Button variant="primary">
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
