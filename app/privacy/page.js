import { Navbar } from "@/components/layout/Navbar";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto pt-24 pb-16 px-6">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <div className="space-y-6 text-lg leading-relaxed">
                    <p>Last Updated: December 23, 2025</p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">1. Introduction</h2>
                        <p>Welcome to AI Interview Prep. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">2. Data We Collect</h2>
                        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data</strong> includes email address.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">3. How We Use Your Data</h2>
                        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>To register you as a new customer.</li>
                            <li>To process and deliver your order including: (a) Manage payments, fees and charges (b) Collect and recover money owed to us.</li>
                            <li>To manage our relationship with you which will include: (a) Notifying you about changes to our terms or privacy policy (b) Asking you to leave a review or take a survey.</li>
                            <li>To enable you to partake in a prize draw, competition or complete a survey.</li>
                            <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary-600 dark:text-primary-400">4. Data Security</h2>
                        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
