"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle"; // Reusing the toggle button style or creating a section?
import { useAuth } from "@/components/providers/AuthProvider";
import { useState } from "react"; // Added useState
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth"; // Firebase imports
import { auth } from "@/lib/firebase"; // Auth import

export default function SettingsPage() {
    const { user } = useAuth();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", content: "" });

    const isGoogleUser = user?.providerData.some((provider) => provider.providerId === "google.com");

    const handleChangePassword = async () => {
        setLoading(true);
        setMsg({ type: "", content: "" });
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setMsg({ type: "success", content: "Password updated successfully!" });
            setIsChangingPassword(false);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error(error);
            setMsg({ type: "error", content: "Failed to update password. Check your current password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account settings and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input label="Email Address" defaultValue={user?.email} disabled />

                    {!isGoogleUser && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-medium">Password</p>
                                    <p className="text-sm text-gray-500">Update your password securely</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(!isChangingPassword)}>
                                    {isChangingPassword ? "Cancel" : "Change Password"}
                                </Button>
                            </div>

                            {isChangingPassword && (
                                <div className="space-y-3 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <Input
                                        type="password"
                                        placeholder="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    {msg.content && (
                                        <p className={`text-sm ${msg.type === "success" ? "text-green-500" : "text-red-500"}`}>
                                            {msg.content}
                                        </p>
                                    )}
                                    <Button onClick={handleChangePassword} loading={loading}>
                                        Update Password
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone Removed */}
        </div>
    );
}
