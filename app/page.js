"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Hero3D } from "@/components/Hero3D";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Mic, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is logged in, don't render landing page to avoid flash
  if (user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-bold tracking-wide">
              AI-POWERED INTERVIEW PREP
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Master Your Next <br />
              <span className="text-gradient">Interview</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
              Practice with our advanced AI interviewer. Get real-time feedback, improve your tone, and land your dream job.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="/signup">
                <Button size="lg" className="shadow-lg shadow-primary-500/20">Get Started Free <ArrowRight className="ml-2 w-5 h-5" /></Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Log In</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-accent-500/20 rounded-full blur-3xl opacity-50"></div>
            <Hero3D />
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-white dark:bg-gray-800/50 mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose AI Interviewer?</h2>
              <p className="text-gray-500">Everything you need to boost your confidence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Mic, title: "Voice Interaction", desc: "Speak naturally. Our AI listens and evaluates your speech clarity and pace." },
                { icon: Zap, title: "Instant Feedback", desc: "Get detailed analysis on your answers immediately after each question." },
                { icon: ShieldCheck, title: "Role Specific", desc: "Tailored questions for Engineering, Product, HR, and more." },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="text-2xl font-bold">AI Interviewer</div>
            <div className="flex gap-6 text-gray-400">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
