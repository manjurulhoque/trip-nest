"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordRequest {
    email: string;
}

// Animation variants
const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 },
    },
};

export function ForgotPasswordForm() {
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<ForgotPasswordRequest>({
        email: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API call to backend
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                toast({
                    title: "Success",
                    description: "Password reset link sent to your email!",
                });
            } else {
                const data = await response.json();
                setError(data.message || "Failed to send reset email");
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to send reset email",
                });
            }
        } catch (error: any) {
            setError(
                error.message || "An error occurred while sending reset email"
            );
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    error.message ||
                    "An error occurred while sending reset email",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        field: keyof ForgotPasswordRequest,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) {
            setError(null);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {success ? (
                <motion.div
                    key="success"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Email Sent
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    We've sent a password reset link to{" "}
                                    <strong>{formData.email}</strong>. Please
                                    check your email and follow the instructions
                                    to reset your password.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Didn't receive the email?</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Check your spam or junk folder</li>
                                    <li>
                                        Make sure you entered the correct email
                                        address
                                    </li>
                                    <li>
                                        Wait a few minutes for the email to
                                        arrive
                                    </li>
                                </ul>
                            </div>

                            <Button
                                onClick={() => {
                                    setSuccess(false);
                                    setFormData({ email: "" });
                                }}
                                variant="outline"
                                className="w-full"
                            >
                                Send Another Email
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <motion.div
                    key="form"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Reset Password</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                {error}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={formData.email}
                                            onChange={(e) =>
                                                handleChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Enter the email address associated with
                                        your account
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isLoading || !formData.email.trim()
                                    }
                                >
                                    {isLoading
                                        ? "Sending..."
                                        : "Send Reset Link"}
                                </Button>
                            </form>

                            <div className="text-center">
                                <Button
                                    variant="link"
                                    onClick={() => router.push("/auth/login")}
                                    className="text-sm"
                                    disabled={isLoading}
                                >
                                    ← Back to Sign In
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
