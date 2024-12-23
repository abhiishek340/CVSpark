"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/global-context";
import MyDocument from "./MyDocument";
import dynamic from "next/dynamic";
import { Download, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import EditablePDFViewer from './EditablePDFViewer';
import { toast } from 'react-hot-toast';

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), { ssr: false });

const ResumeLayout: React.FC = () => {
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
    addProjectData,
    addExperienceData,
    addSkillsData,
    addEducationData,
    addPersonalData,
    saveAsDefault,
    updatePersonalData,
    updateEducationData,
    updateExperienceData,
    updateProjectData,
    updateSkillsData
  } = useGlobalContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPDF, setShowPDF] = useState(true);
  const [key, setKey] = useState(0); // Add this to force re-render
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Force re-render when data changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [projectData, skillsData, experienceData, educationData, personalData, font, fontSize, colors, margins]);

  useEffect(() => {
    if (isMobile) {
      setShowPDF(false);
    }
  }, [isMobile]);

  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <MyDocument 
          projectData={projectData}
          skillsData={skillsData}
          experienceData={experienceData}
          educationData={educationData}
          personalData={personalData}
          font={font}
          fontSize={fontSize}
          colors={colors}
          margins={margins}
        />
      ).toBlob();
      saveAs(blob, 'resume.pdf');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleUpdate = (type: 'personal' | 'education' | 'experience' | 'project' | 'skill', index: number, field: string, value: string) => {
    switch (type) {
      case 'personal':
        updatePersonalData(index, field, value);
        break;
      case 'education':
        updateEducationData(index, field, value);
        break;
      case 'experience':
        updateExperienceData(index, field, value);
        break;
      case 'project':
        updateProjectData(index, field, value);
        break;
      case 'skill':
        updateSkillsData(index, field, value);
        break;
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-end items-center gap-2 mb-4">
        <Button
          onClick={async () => {
            await saveAsDefault();
            toast.success('Current version saved as default');
          }}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="w-3 h-3 mr-1" />
          Save as Default
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="w-3 h-3 mr-1" />
          Download PDF
        </Button>
        {!isMobile && (
          <Button
            onClick={() => setShowPDF(!showPDF)}
            variant="outline"
            size="sm"
          >
            {showPDF ? 'Switch to Editor' : 'Switch to PDF'}
          </Button>
        )}
      </div>

      <div className="relative">
        {showPDF ? (
          <div key={key} className="w-full">
            <PDFViewer 
              className="w-full h-[calc(100vh-12rem)]" 
              showToolbar={false}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <MyDocument 
                projectData={projectData}
                skillsData={skillsData}
                experienceData={experienceData}
                educationData={educationData}
                personalData={personalData}
                font={font}
                fontSize={fontSize}
                colors={colors}
                margins={margins}
              />
            </PDFViewer>
          </div>
        ) : (
          <EditablePDFViewer
            projectData={projectData}
            skillsData={skillsData}
            experienceData={experienceData}
            educationData={educationData}
            personalData={personalData}
            isEditing={true}
            font={font}
            fontSize={fontSize}
            colors={colors}
            margins={margins}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeLayout;
