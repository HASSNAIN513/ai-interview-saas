"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">
                        Something went wrong!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                        We apologize for the inconvenience. A critical error occurred.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={() => reset()} variant="primary">
                            Try Again
                        </Button>
                        <Button onClick={() => window.location.href = "/"} variant="outline">
                            Go Home
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}
