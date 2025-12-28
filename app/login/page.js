"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithCredential } from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        // Handle Redirect Result (For Mobile App)
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log("Redirect Login Success:", result.user);
                    router.push("/dashboard");
                }
            } catch (error) {
                console.error("Redirect Login Error:", error);
                setError(error.message);
            }
        };

        if (Capacitor.isNativePlatform()) {
            checkRedirect();
        }

        if (!authLoading && user) {
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                // Native Login
                const user = await GoogleAuth.signIn();
                const idToken = user.authentication.idToken;
                const credential = GoogleAuthProvider.credential(idToken);
                await signInWithCredential(auth, credential);
                router.push("/dashboard");
            } else {
                // Web Login
                const provider = new GoogleAuthProvider();
                provider.setCustomParameters({ prompt: 'select_account' });
                await signInWithPopup(auth, provider);
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Google Login Error:", err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full" loading={loading}>Log In</Button>
                    </form>

                    <div className="mt-4 flex items-center justify-between">
                        <hr className="w-full border-gray-300 dark:border-gray-700" />
                        <span className="px-2 text-gray-500 text-sm">Or</span>
                        <hr className="w-full border-gray-300 dark:border-gray-700" />
                    </div>

                    <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
                        Sign in with Google
                    </Button>

                    <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Don&apos;t have an account? <Link href="/signup" className="text-primary-600 hover:underline">Sign Up</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
