"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle"; // Need to create this
import { Button } from "@/components/ui/Button";
import { User as UserIcon, LogOut } from "lucide-react"; // Added LogOut
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Navbar(props) {
    const { user } = useAuth();
    const router = useRouter();
    const [imageError, setImageError] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg fixed top-0 w-full z-40 px-4 md:px-6 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-3">
                {/* 1.3 Mobile Hamburger Trigger */}
                {user && (
                    <button
                        onClick={props.onMenuClick}
                        className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                <Link href="/" className="text-xl font-bold text-gradient flex items-center gap-2">
                    <span className="bg-primary-500 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">AI</span>
                    <span className="hidden sm:inline">Interview Prep</span>
                </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* <ThemeToggle /> Removed as per request */}

                {user ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden md:block text-sm text-right">
                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{user.displayName || "User"}</p>
                        </div>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 overflow-hidden ring-2 ring-transparent hover:ring-primary-500 transition-all cursor-pointer">

                            {user.photoURL && !imageError ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={user.photoURL}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                        onError={() => setImageError(true)}
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            ) : (
                                <UserIcon className="w-5 h-5" />
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={handleSignOut}
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
