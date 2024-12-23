"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string) => void;
}

export function JobDescriptionInput({ onSubmit }: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectSubmit = () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    onSubmit(jobDescription);
  };

  const handleUrlSubmit = async () => {
    if (!jobUrl.trim()) {
      toast.error('Please enter a LinkedIn job URL');
      return;
    }

    if (!jobUrl.includes('linkedin.com/jobs')) {
      toast.error('Please enter a valid LinkedIn job URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDescription',
          url: jobUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job description');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.description) {
        setJobDescription(data.description);
        onSubmit(data.description);
        toast.success('Job description loaded successfully');
      } else {
        throw new Error('No job description found');
      }
    } catch (error) {
      console.error('Error fetching job description:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch job description');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Description</TabsTrigger>
            <TabsTrigger value="url">LinkedIn URL</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label>Paste Job Description</Label>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <Button 
              onClick={handleDirectSubmit}
              className="w-full"
              disabled={!jobDescription.trim()}
            >
              Generate Tailored Resume
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label>LinkedIn Job URL</Label>
              <Input
                placeholder="https://www.linkedin.com/jobs/view/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleUrlSubmit}
              className="w-full"
              disabled={isLoading || !jobUrl.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Description...
                </>
              ) : (
                'Load Job Description'
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
