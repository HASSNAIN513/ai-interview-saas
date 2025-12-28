import { Navbar } from "@/components/layout/Navbar";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto pt-24 pb-16 px-6">
                <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>Last Updated: December 23, 2025</p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">1. Agreement to Terms</h2>
                        <p>By accessing our website, you agree to be bound by these Terms and Conditions and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">2. Intellectual Property Rights</h2>
                        <p>Other than the content you own, under these Terms, AI Interview Prep and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">3. Restrictions</h2>
                        <p>You are specifically restricted from all of the following:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>publishing any Website material in any other media;</li>
                            <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                            <li>publicly performing and/or showing any Website material;</li>
                            <li>using this Website in any way that is or may be damaging to this Website;</li>
                            <li>using this Website in any way that impacts user access to this Website;</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">4. Limitation of Liability</h2>
                        <p>In no event shall AI Interview Prep, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. AI Interview Prep, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
