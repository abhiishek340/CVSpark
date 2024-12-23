"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Wand2 } from 'lucide-react'
import ResumeLayout from "../resume/components/resume-layout"
import { useGlobalContext } from "@/context/global-context"
import { generateTailoredContent } from "@/lib/gemini-service"
import { toast } from "react-hot-toast"
import LayoutTools from "../resume/components/LayoutTools"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { FloatingNav } from "@/components/FloatingNav"

export default function GeneratePage() {
  const [jobDescription, setJobDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [useDefaultResume, setUseDefaultResume] = useState(false)
  const {
    projectData,
    experienceData,
    personalData,
    educationData,
    skillsData,
    addProjectData,
    addExperienceData,
    saveAsDefault,
    loadDefaultResume,
  } = useGlobalContext()

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description")
      return
    }

    setIsGenerating(true)
    try {
      const resumeData = {
        projects: projectData,
        experiences: experienceData,
        personal: personalData,
        education: educationData,
        skills: skillsData,
      }

      const tailoredContent = await generateTailoredContent(resumeData, jobDescription)

      // Update the resume with tailored content
      addExperienceData(tailoredContent.experiences)
      addProjectData(tailoredContent.projects)

      toast.success("Resume tailored successfully!")
    } catch (error) {
      console.error("Error generating resume:", error)
      toast.error("Failed to generate resume. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-0 z-10">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tailor Your Resume</h1>
            <FloatingNav />
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-20">
        <Card className="mb-1 border-0 shadow-none bg-white dark:bg-gray-900/95">
          <CardContent className="pt-2">
            <div className="relative">
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here, and I'll help you tailor your resume to match the requirements..."
                className="min-h-[120px] resize-none bg-white dark:bg-gray-900/90 dark:text-gray-100 dark:placeholder-gray-400"
                rows={4}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="use-default"
                    checked={useDefaultResume}
                    onCheckedChange={setUseDefaultResume}
                  />
                  <label
                    htmlFor="use-default"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    Use Default Resume
                  </label>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Generate Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,320px] gap-2">
          <div 
            className="bg-white dark:bg-gray-900/95 rounded-lg overflow-hidden"
            style={{
              height: 'calc(100vh - 120px)',
              overflowY: 'auto',
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)'
            }}
          >
            <div className="p-2">
              <ResumeLayout />
            </div>
          </div>

          <Card className="dark:bg-gray-900/95 dark:text-gray-100">
        
            <CardContent className="space-y-4 border-0 shadow-none">
              <LayoutTools />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

