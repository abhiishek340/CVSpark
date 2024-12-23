"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BackButton } from "@/components/back-button";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Always redirect new users to onboarding
            router.push('/onboarding');
            
        } catch (error: any) {
            console.error('Signup error:', error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already in use. Please try logging in instead.');
            } else {
                toast.error('Failed to create account. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>
            <div className="flex justify-center items-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center dark:text-gray-100">Create an Account</CardTitle>
                            <CardDescription className="text-center dark:text-gray-400">
                                Enter your email and password to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUp; 