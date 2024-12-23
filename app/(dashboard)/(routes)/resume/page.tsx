"use client";

import RouteGuard from '@/components/route-guard';
import { ResumeForm } from './components/resume-form';
import ResumeLayout from './components/resume-layout';
import { useGlobalContext } from '@/context/global-context';
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, FileText } from 'lucide-react';

const ResumePage = () => {
    const { saveUserData, user } = useGlobalContext();

    const handleSaveData = async () => {
        if (!user) {
            toast.error('Please log in to save your resume data');
            return;
        }

        try {
            const saveSuccessful = await saveUserData();
            if (saveSuccessful) {
                toast.success('Resume data saved successfully');
            } else {
                toast.error('Failed to save resume data. Please try again.');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('An unexpected error occurred while saving. Please try again.');
        }
    };

    return (
        <RouteGuard>
            <div className="min-h-screen bg-[#f5f8fc]">
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-[1800px] mx-auto"
                    >
                        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center space-x-3">
                                <FileText className="h-8 w-8 text-gray-700" />
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Resume Builder
                                </h1>
                            </div>
                            <Button 
                                onClick={handleSaveData} 
                                disabled={!user}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {user ? 'Save Resume' : 'Log in to Save'}
                            </Button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/3">
                                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    <ResumeForm />
                                </div>
                            </div>
                            <div className="lg:w-2/3">
                                <div className="sticky top-8">
                                    <ResumeLayout />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </RouteGuard>
    );
};

export default ResumePage;
