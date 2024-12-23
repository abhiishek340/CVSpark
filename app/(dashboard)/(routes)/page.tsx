import { useState } from "react";
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Briefcase, Zap, ChevronRight, Play } from 'lucide-react'
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export default function Home() {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="min-h-[calc(100vh-5rem)]">
          <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
            {/* Left Column - Content */}
            <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
              <div className="max-w-xl mx-auto lg:mx-0 space-y-8 relative z-10">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    AI-Powered Resume Tailoring
                  </h1>
                  <p className="text-xl text-gray-600">
                    FutureFit analyzes job descriptions and your experience to create perfectly tailored resumes that land interviews.
                  </p>
                </div>
                <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-[#2557a7] hover:bg-[#1e4687] text-white px-8 py-6 rounded-lg text-lg font-semibold relative overflow-hidden group"
                    >
                      <span className="relative z-10">Create My Resume</span>
                      <ArrowRight className="ml-2 h-5 w-5 relative z-10" />
                      <div className="absolute inset-0 h-full w-full bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                      <div className="absolute inset-0 h-full w-full bg-[#1e4687] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left delay-150"></div>
                    </Button>
                  </Link>
                </div>
                <div className="pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[
                        '/images/image.jpg',
                        '/images/image1.jpg',
                        '/images/image2.jpg',
                        '/images/image3.jpg'
                      ].map((src, i) => (
                        <div
                          key={i}
                          className="relative w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                        >
                          <Image
                            src={src}
                            alt={`User ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 40px, 40px"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Join over 10,000+ professionals who trust FutureFit
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-100 transform -skew-y-6 -z-10"></div>
            </div>

            {/* Right Column - Video */}
            <div className="hidden lg:flex items-center justify-center relative overflow-hidden">
              <div className="relative w-[95%] h-[90vh] rounded-xl shadow-2xl z-10 overflow-hidden mx-4">
                {isVideoLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <motion.div 
                      className="relative w-24 h-24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <motion.span 
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1] 
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                      />
                      <motion.span 
                        className="absolute inset-2 rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500"
                        animate={{ 
                          scale: [1.2, 1, 1.2],
                          opacity: [0.8, 1, 0.8] 
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="w-4 h-4 bg-blue-500 rounded-full"
                          animate={{ 
                            scale: [1, 0.8, 1],
                            opacity: [1, 0.6, 1] 
                          }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}
                <video
                  className="absolute inset-0 w-[120%] h-full object-cover rounded-xl -right-[10%]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: '85% center'
                  }}
                  onLoadedData={() => setIsVideoLoading(false)}
                  onLoadedMetadata={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.playbackRate = 1.2;
                  }}
                >
                  <source src="/images/loom-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-gradient-to-r from-blue-200/10 to-indigo-200/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-30 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 relative overflow-hidden scroll-mt-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose FutureFit</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FileText className="h-8 w-8 text-[#2557a7]" />}
                title="AI-Powered Customization"
                description="Our AI analyzes job descriptions to tailor your resume, highlighting the most relevant skills and experiences."
              />
              <FeatureCard 
                icon={<Briefcase className="h-8 w-8 text-[#2557a7]" />}
                title="Industry-Specific Templates"
                description="Choose from a variety of ATS-friendly templates designed for your specific industry and role."
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-[#2557a7]" />}
                title="Instant Updates"
                description="Easily update your resume for different job applications with our one-click optimization feature."
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
          <div 
            className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10 dark:opacity-5" 
            style={{ maskImage: 'linear-gradient(180deg,white,rgba(255,255,255,0))' }}
          ></div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 relative overflow-hidden scroll-mt-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard 
                number="1"
                title="Upload Your Experience"
                description="Input your work history, skills, and education or upload your existing resume."
              />
              <StepCard 
                number="2"
                title="Add Job Description"
                description="Paste the job description you're applying for or select an industry and role."
              />
              <StepCard 
                number="3"
                title="Generate & Download"
                description="Our AI tailors your resume to the job. Review, edit if needed, and download your optimized resume."
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-white"></div>
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-50 to-transparent transform skew-x-12"></div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 relative z-10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 relative z-10">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 relative z-10">{description}</p>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-200 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-tl-full transform translate-x-8 translate-y-8 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300"></div>
    </Card>
  )
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group">
      <div className="flex items-center justify-center w-12 h-12 bg-[#2557a7] dark:bg-blue-600 text-white rounded-full mb-4 text-xl font-bold relative z-10">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 relative z-10">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 relative z-10">{description}</p>
      <div className="absolute bottom-2 right-2 text-[#2557a7] dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ChevronRight size={24} />
      </div>
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
    </Card>
  )
}

