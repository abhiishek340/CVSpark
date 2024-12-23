"use client";

import { useState, useEffect } from 'react';
import { auth, db, getFirestoreFunctions } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGlobalContext } from '@/context/global-context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BackButton } from "@/components/back-button";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { user } = useGlobalContext();

    useEffect(() => {
        const checkDefaultData = async () => {
            if (user) {
                try {
                    const { doc, getDoc } = await getFirestoreFunctions();
                    const docRef = doc(db, 'users', user.uid, 'resumes', 'default');
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        localStorage.setItem('isInitialAuth', 'true');
                        router.push('/generate');
                    } else {
                        localStorage.setItem('isInitialAuth', 'true');
                        router.push('/onboarding');
                    }
                } catch (error) {
                    console.error('Error checking default data:', error);
                    router.push('/onboarding');
                }
            }
        };

        checkDefaultData();
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Logged in successfully');
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Failed to log in. Please check your credentials.');
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
                            <CardTitle className="text-2xl font-bold text-center dark:text-gray-100">Welcome Back</CardTitle>
                            <CardDescription className="text-center dark:text-gray-400">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
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
                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>
                                <p className="text-sm text-gray-600">
                                    Don&apos;t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
