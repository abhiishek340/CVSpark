"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectDataType, Skill, Experience, Education, Personal } from "@/types";

interface EditablePDFViewerProps {
  projectData: ProjectDataType[];
  skillsData: Skill[];
  experienceData: Experience[];
  educationData: Education[];
  personalData: Personal[];
  isEditing?: boolean;
  font?: string;
  fontSize?: number;
  colors?: {
    primary: string;
    secondary: string;
  };
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onUpdate: (type: 'personal' | 'education' | 'experience' | 'project' | 'skill', index: number, field: string, value: string) => void;
}

const EditablePDFViewer: React.FC<EditablePDFViewerProps> = ({
  projectData,
  skillsData,
  experienceData,
  educationData,
  personalData,
  isEditing = false,
  font = "Carlito",
  fontSize = 10.5,
  colors = { primary: "#000000", secondary: "#666666" },
  margins = { top: 30, right: 30, bottom: 30, left: 30 },
  onUpdate
}) => {
  const renderEditableField = (value: string, onChange: (value: string) => void, multiline = false, large = false) => {
    const commonStyles = "w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-colors border-0 border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-none px-1";
    
    return multiline ? (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${commonStyles} ${large ? 'min-h-[200px]' : 'min-h-[60px]'} resize-none`}
      />
    ) : (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={commonStyles}
      />
    );
  };

  return (
    <div className="space-y-8 p-6 dark:bg-gray-900" style={{ fontFamily: font, fontSize: `${fontSize}px` }}>
      {/* Personal Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2 dark:text-gray-100">Personal Information</h2>
        {personalData.map((person, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Name</label>
              {renderEditableField(person.name, (newValue) => onUpdate('personal', index, 'name', newValue))}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
              {renderEditableField(person.email, (newValue) => onUpdate('personal', index, 'email', newValue))}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Phone</label>
              {renderEditableField(person.phone, (newValue) => onUpdate('personal', index, 'phone', newValue))}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">City</label>
              {renderEditableField(person.city, (newValue) => onUpdate('personal', index, 'city', newValue))}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">State</label>
              {renderEditableField(person.state, (newValue) => onUpdate('personal', index, 'state', newValue))}
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">GitHub</label>
                {renderEditableField(person.github, (newValue) => onUpdate('personal', index, 'github', newValue))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">LinkedIn</label>
                {renderEditableField(person.linkedin, (newValue) => onUpdate('personal', index, 'linkedin', newValue))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Website</label>
                {renderEditableField(person.website, (newValue) => onUpdate('personal', index, 'website', newValue))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Education Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2 dark:text-gray-100">Education</h2>
        {educationData.map((edu, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">University</label>
                {renderEditableField(edu.university, (newValue) => onUpdate('education', index, 'university', newValue))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Major</label>
                {renderEditableField(edu.major, (newValue) => onUpdate('education', index, 'major', newValue))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">GPA</label>
                {renderEditableField(edu.gpa, (newValue) => onUpdate('education', index, 'gpa', newValue))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Level</label>
                {renderEditableField(edu.level, (newValue) => onUpdate('education', index, 'level', newValue))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Graduation Date</label>
                {renderEditableField(edu.graduation_date, (newValue) => onUpdate('education', index, 'graduation_date', newValue))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Coursework</label>
              {renderEditableField(edu.coursework, (newValue) => onUpdate('education', index, 'coursework', newValue))}
            </div>
          </div>
        ))}
      </section>

      {/* Experience Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2 dark:text-gray-100">Experience</h2>
        {experienceData.map((exp, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Title</label>
                {renderEditableField(exp.title, (newValue) => onUpdate('experience', index, 'title', newValue))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Company</label>
                {renderEditableField(exp.company, (newValue) => onUpdate('experience', index, 'company', newValue))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Start Date</label>
                {renderEditableField(exp.start_date, (newValue) => onUpdate('experience', index, 'start_date', newValue))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">End Date</label>
                {renderEditableField(exp.end_date, (newValue) => onUpdate('experience', index, 'end_date', newValue))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Detailed Experience</label>
              {renderEditableField(
                exp.detailed_experience, 
                (newValue) => onUpdate('experience', index, 'detailed_experience', newValue), 
                true, 
                true
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Projects Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2 dark:text-gray-100">Projects</h2>
        {projectData.map((project, index) => (
          <div key={index} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {Object.entries(project).map(([field, value]) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                  {field.replace('_', ' ')}
                </label>
                {renderEditableField(
                  value as string, 
                  (newValue) => onUpdate('project', index, field, newValue),
                  field === 'description',
                  field === 'description'
                )}
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Skills Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2 dark:text-gray-100">Skills</h2>
        {skillsData.map((skill, index) => (
          <div key={index} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {Object.entries(skill).map(([field, value]) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                  {field.replace('_', ' ')}
                </label>
                {renderEditableField(value as string, (newValue) => 
                  onUpdate('skill', index, field, newValue)
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
};

export default EditablePDFViewer;
