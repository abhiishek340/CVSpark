"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "../resume/components/info";
import { Education } from "../resume/components/education";
import { Experience } from "../resume/components/experience";
import { Projects } from "../resume/components/projects";
import { Skills } from "../resume/components/skills";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/global-context";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

const steps = [
    { id: 'personal', title: 'Personal Info', component: Info },
    { id: 'education', title: 'Education', component: Education },
    { id: 'experience', title: 'Experience', component: Experience },
    { id: 'projects', title: 'Projects', component: Projects },
    { id: 'skills', title: 'Skills', component: Skills },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();
    const { saveAsDefault } = useGlobalContext();

    const handleNext = async () => {
        if (currentStep === steps.length - 1) {
            // Save all data as default
            await saveAsDefault();
            // Redirect to generate page
            router.push('/generate');
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Let&apos;s build your resume
                </h1>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {steps.map((step, index) => (
                        <div 
                            key={step.id}
                            className={`flex items-center ${
                                index <= currentStep ? 'text-blue-600 dark:text-blue-400' : ''
                            }`}
                        >
                            {index < currentStep ? (
                                <Check className="w-4 h-4 mr-1" />
                            ) : null}
                            {step.title}
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <CurrentStepComponent data={{ type: steps[currentStep].title }} />
            </motion.div>

            <div className="flex justify-between mt-8">
                <Button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    variant="outline"
                >
                    Back
                </Button>
                <Button onClick={handleNext}>
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </div>
        </div>
    );
} 