"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGlobalContext } from '@/context/global-context';
import { generateTailoredContent } from '@/lib/gemini-service';
import { pdf } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import { toast } from 'react-hot-toast';
import { Loader2, Search } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  easyApplyLink: string;
}

export function JobSearch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('software engineering intern');
  const [location, setLocation] = useState('');
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);

  const {
    projectData,
    skillsData,
    experienceData,
    educationData,
    personalData,
    font,
    fontSize,
    colors,
    margins,
    saveAiGenerated
  } = useGlobalContext();

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}&f_AL=true&sortBy=DD${location ? `&location=${encodeURIComponent(location)}` : ''}`;
      
      const response = await fetch('/api/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'searchJobs',
          query: searchQuery,
          url: searchUrl  // Add this line to pass the URL
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }

      const data = await response.json();
      setJobs(data);
      setCurrentJobIndex(0);
      toast.success(`Found ${data.length} jobs with Easy Apply`);
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast.error('Failed to search jobs');
    } finally {
      setIsSearching(false);
    }
  };

  const applyToCurrentJob = async () => {
    if (currentJobIndex >= jobs.length) {
      setAutoApplyEnabled(false);
      toast.success('Finished applying to all jobs!');
      return;
    }

    const currentJob = jobs[currentJobIndex];
    
    try {
      setIsApplying(true);

      // 1. Get job description
      const descResponse = await fetch('/api/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDescription',
          url: currentJob.easyApplyLink,
        }),
      });

      if (!descResponse.ok) {
        throw new Error('Failed to get job description');
      }

      const { description } = await descResponse.json();

      // 2. Generate tailored resume using AI
      const resumeData = {
        projects: projectData,
        experiences: experienceData,
        personal: personalData,
        education: educationData,
        skills: skillsData,
      };

      const tailoredContent = await generateTailoredContent(resumeData, description);

      // 3. Generate PDF
      const blob = await pdf(
        <MyDocument
          projectData={tailoredContent.projects}
          skillsData={skillsData}
          experienceData={tailoredContent.experiences}
          educationData={educationData}
          personalData={personalData}
          font={font}
          fontSize={fontSize}
          colors={colors}
          margins={margins}
        />
      ).toBlob();

      // 4. Apply to job
      const applyResponse = await fetch('/api/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'applyToJob',
          url: currentJob.easyApplyLink,
          resumeBlob: blob,
        }),
      });

      if (!applyResponse.ok) {
        throw new Error('Failed to apply to job');
      }

      // Save the AI-generated resume
      await saveAiGenerated(description);

      toast.success(`Applied to ${currentJob.title} at ${currentJob.company}`);
      setCurrentJobIndex(prev => prev + 1);

      // Continue with next job if auto-apply is enabled
      if (autoApplyEnabled) {
        setTimeout(() => {
          applyToCurrentJob();
        }, 2000);
      }

    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Failed to apply to job');
      setAutoApplyEnabled(false);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>LinkedIn Easy Apply Job Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Job Title, Keywords, or Company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Location (Optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Jobs
                </>
              )}
            </Button>
          </div>

          {jobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  Found {jobs.length} Easy Apply jobs (Currently on {currentJobIndex + 1})
                </div>
                <Button
                  onClick={() => {
                    setAutoApplyEnabled(!autoApplyEnabled);
                    if (!autoApplyEnabled) {
                      applyToCurrentJob();
                    }
                  }}
                  disabled={isApplying}
                  variant={autoApplyEnabled ? "destructive" : "default"}
                >
                  {autoApplyEnabled ? 'Stop Auto Apply' : 'Start Auto Apply'}
                </Button>
              </div>

              <Card className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{jobs[currentJobIndex]?.title}</h3>
                    <p className="text-sm text-gray-600">{jobs[currentJobIndex]?.company}</p>
                    <p className="text-sm text-gray-600">{jobs[currentJobIndex]?.location}</p>
                  </div>
                  <Button
                    onClick={() => applyToCurrentJob()}
                    disabled={isApplying || autoApplyEnabled}
                    className="flex items-center gap-2"
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
