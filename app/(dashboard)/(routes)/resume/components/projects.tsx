"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGlobalContext } from '@/context/global-context';
import { Delete } from 'lucide-react';
import { toast } from "react-hot-toast";
import { ProjectDataType } from "@/types";

interface ProjectsProps {
  data: {
    type: string;
  };
}

export function Projects({ data }: ProjectsProps) {
  const { 
    addProjectData, 
    projectData,
    defaultProjectData 
  } = useGlobalContext();

  const initialProject: ProjectDataType[] = [{
    title: "",
    description: "",
    technologies: "",
    link: ""
  }];

  const [projects, setProjects] = useState<ProjectDataType[]>(initialProject);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projectData');
    
    if (projectData.length > 0) {
      setProjects(projectData);
    } else if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else if (defaultProjectData.length > 0) {
      setProjects(defaultProjectData);
      localStorage.setItem('projectData', JSON.stringify(defaultProjectData));
      addProjectData(defaultProjectData);
    } else {
      const initialProject = [{
        title: '',
        description: '',
        technologies: '',
        link: ''
      }];
      setProjects(initialProject);
      localStorage.setItem('projectData', JSON.stringify(initialProject));
      addProjectData(initialProject);
    }
  }, [projectData, defaultProjectData, addProjectData]);

  const handleAddForm = useCallback(() => {
    setProjects(prev => [...prev, {
      title: '',
      description: '',
      technologies: '',
      link: ''
    }]);
  }, []);

  const handleSaveProjects = useCallback(() => {
    localStorage.setItem('projectData', JSON.stringify(projects));
    addProjectData(projects);
    toast.success('Projects Added on Resume');
  }, [projects, addProjectData]);

  const handleChange = useCallback((index: number, field: keyof ProjectDataType, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  }, []);

  const handleDeleteAll = useCallback(() => {
    localStorage.removeItem("projectData");
    setProjects([]);
    addProjectData([]);
  }, [addProjectData]);

  const handleDeleteProject = useCallback((index: number) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.filter((_, i) => i !== index);
      localStorage.setItem('projectData', JSON.stringify(updatedProjects));
      addProjectData(updatedProjects);
      return updatedProjects;
    });
  }, [addProjectData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{data.type}</CardTitle>
          <Delete className="cursor-pointer" size={24} onClick={handleDeleteAll} />
        </div>
      </CardHeader>
      <CardContent>
        {projects.map((project, index) => (
          <form key={index}>
            <div className="grid w-full items-center gap-4 mb-5">
              <div className="flex items-center">
                <div className="flex flex-col space-y-1.5 flex-grow">
                  <div className="flex items-center justify-between">
                    <Label>Project Name</Label>
                    <Button className="text-red-500" onClick={() => handleDeleteProject(index)}>-</Button>
                  </div>
                  <Input
                    id={`project-name-${index}`}
                    placeholder="Enter project name"
                    onChange={e => handleChange(index, 'title', e.target.value)}
                    value={project.title}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`project-tech-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Technologies
                  </label>
                  <Input
                    type="text"
                    id={`project-tech-${index}`}
                    placeholder="Enter technologies used (e.g., React, Node.js, Python)"
                    onChange={e => handleChange(index, 'technologies', e.target.value)}
                    value={project.technologies}
                  />
                </div>
                <div>
                  <label htmlFor={`project-link-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Link
                  </label>
                  <Input
                    type="text"
                    id={`project-link-${index}`}
                    placeholder="Enter project URL (optional)"
                    onChange={e => handleChange(index, 'link', e.target.value)}
                    value={project.link}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  id={`project-description-${index}`}
                  placeholder="Describe your project's purpose, features, and your role in its development. Include measurable outcomes if applicable."
                  onChange={e => handleChange(index, 'description', e.target.value)}
                  value={project.description}
                />
              </div>
            </div>
            {index < projects.length - 1 && <hr className="border-gray-600 mb-5" />}
          </form>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="mr-1" onClick={handleAddForm}>+1</Button>
        <Button onClick={handleSaveProjects}>Save Projects</Button>
      </CardFooter>
    </Card>
  );
}
