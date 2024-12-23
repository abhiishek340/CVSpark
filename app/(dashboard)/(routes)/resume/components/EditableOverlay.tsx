"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditableOverlayProps {
  data: {
    personal: any[];
    education: any[];
    experience: any[];
    projects: any[];
    skills: any[];
  };
  onUpdate: (type: 'personal' | 'education' | 'experience' | 'project' | 'skill', index: number, field: string, value: string) => void;
}

const EditableOverlay: React.FC<EditableOverlayProps> = ({ data, onUpdate }) => {
  const overlayStyles = {
    input: "absolute h-[1.2em] px-1 bg-transparent hover:bg-white/10 focus:bg-white/20 transition-colors border-0 focus:border-0 focus:outline-none focus:ring-0 text-transparent selection:bg-blue-200/20 selection:text-black placeholder:text-transparent",
    textarea: "absolute bg-transparent hover:bg-white/10 focus:bg-white/20 transition-colors border-0 focus:border-0 focus:outline-none focus:ring-0 text-transparent selection:bg-blue-200/20 selection:text-black min-h-[60px] placeholder:text-transparent resize-none p-0",
    section: "absolute left-[30px] right-[30px]",
  };

  return (
    <div className="absolute inset-0 bg-transparent pointer-events-none" style={{ zIndex: 1000 }}>
      <div className="relative w-[612px] mx-auto" style={{ height: '792px' }}>
        {/* Personal Info Section */}
        <div className={`${overlayStyles.section} top-[40px]`} style={{ pointerEvents: 'auto' }}>
          <div className="relative">
            <Input
              value={data.personal[0]?.name || ''}
              onChange={(e) => onUpdate('personal', 0, 'name', e.target.value)}
              className={`${overlayStyles.input} text-[22px] font-bold`}
              style={{ width: '300px', top: 0, left: 0 }}
            />
          </div>
          <div className="relative mt-6">
            <Input
              value={data.personal[0]?.phone || ''}
              onChange={(e) => onUpdate('personal', 0, 'phone', e.target.value)}
              className={overlayStyles.input}
              style={{ width: '120px', top: 0, left: 0 }}
            />
            <Input
              value={data.personal[0]?.email || ''}
              onChange={(e) => onUpdate('personal', 0, 'email', e.target.value)}
              className={overlayStyles.input}
              style={{ width: '200px', top: 0, left: '130px' }}
            />
          </div>
        </div>

        {/* Education Section */}
        <div className={`${overlayStyles.section} top-[120px]`} style={{ pointerEvents: 'auto' }}>
          {data.education.map((edu, index) => (
            <div key={index} className="relative mb-6">
              <div className="relative mb-2">
                <Input
                  value={edu.university}
                  onChange={(e) => onUpdate('education', index, 'university', e.target.value)}
                  className={`${overlayStyles.input} font-bold`}
                  style={{ width: '250px', top: 0, left: 0 }}
                />
                <Input
                  value={edu.major}
                  onChange={(e) => onUpdate('education', index, 'major', e.target.value)}
                  className={overlayStyles.input}
                  style={{ width: '200px', top: 0, right: 0 }}
                />
              </div>
              <div className="relative mt-2">
                <Input
                  value={edu.coursework}
                  onChange={(e) => onUpdate('education', index, 'coursework', e.target.value)}
                  className={overlayStyles.input}
                  style={{ width: '100%', top: 0 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className={`${overlayStyles.section} top-[250px]`} style={{ pointerEvents: 'auto' }}>
          {data.experience.map((exp, index) => (
            <div key={index} className="relative mb-6">
              <div className="relative mb-2">
                <Input
                  value={exp.title}
                  onChange={(e) => onUpdate('experience', index, 'title', e.target.value)}
                  className={`${overlayStyles.input} font-bold`}
                  style={{ width: '250px', top: 0, left: 0 }}
                />
                <Input
                  value={exp.company}
                  onChange={(e) => onUpdate('experience', index, 'company', e.target.value)}
                  className={overlayStyles.input}
                  style={{ width: '200px', top: 0, right: 0 }}
                />
              </div>
              <div className="relative mt-4">
                <Textarea
                  value={exp.detailed_experience}
                  onChange={(e) => onUpdate('experience', index, 'detailed_experience', e.target.value)}
                  className={overlayStyles.textarea}
                  style={{ width: '100%', top: 0 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className={`${overlayStyles.section} top-[480px]`} style={{ pointerEvents: 'auto' }}>
          {data.projects.map((project, index) => (
            <div key={index} className="relative mb-6">
              <div className="relative mb-2">
                <Input
                  value={project.name}
                  onChange={(e) => onUpdate('project', index, 'name', e.target.value)}
                  className={`${overlayStyles.input} font-bold`}
                  style={{ width: '300px', top: 0, left: 0 }}
                />
                <Input
                  value={project.language}
                  onChange={(e) => onUpdate('project', index, 'language', e.target.value)}
                  className={overlayStyles.input}
                  style={{ width: '200px', top: 0, right: 0 }}
                />
              </div>
              <div className="relative mt-4">
                <Textarea
                  value={project.description}
                  onChange={(e) => onUpdate('project', index, 'description', e.target.value)}
                  className={overlayStyles.textarea}
                  style={{ width: '100%', top: 0 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className={`${overlayStyles.section} top-[680px]`} style={{ pointerEvents: 'auto' }}>
          {data.skills.map((skill, index) => (
            <div key={index} className="relative mb-4">
              <div className="relative">
                <Input
                  value={skill.languages}
                  onChange={(e) => onUpdate('skill', index, 'languages', e.target.value)}
                  className={overlayStyles.input}
                  style={{ width: '75%', top: 0, left: '25%' }}
                />
              </div>
              <div className="relative mt-4">
                <Input
                  value={skill.frameworks}
                  onChange={(e) => onUpdate('skill', index, 'frameworks', e.target.value)}
                  className={overlayStyles.input}
                  style={{ width: '75%', top: 0, left: '25%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditableOverlay;
