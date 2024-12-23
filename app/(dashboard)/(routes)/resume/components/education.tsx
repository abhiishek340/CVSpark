import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalContext } from '@/context/global-context';
import { Delete } from 'lucide-react';

interface EducationProps {
  data: {
    type: string;
  };
}

export function Education({ data }: EducationProps) {
  const { 
    addEducationData, 
    educationData,
    defaultEducationData 
  } = useGlobalContext();

  const [education, setEducation] = useState<Array<{
    university: string;
    major: string;
    gpa: string;
    level: string;
    graduation_date: string;
    coursework: string;
  }>>([]);

  useEffect(() => {
    const storedEducation = localStorage.getItem('educationData');
    
    if (educationData.length > 0) {
      setEducation(educationData);
    } else if (storedEducation) {
      setEducation(JSON.parse(storedEducation));
    } else if (defaultEducationData.length > 0) {
      setEducation(defaultEducationData);
      localStorage.setItem('educationData', JSON.stringify(defaultEducationData));
      addEducationData(defaultEducationData);
    } else {
      const initialEducation = [{
        university: '',
        major: '',
        gpa: '',
        level: '',
        graduation_date: '',
        coursework: ''
      }];
      setEducation(initialEducation);
      localStorage.setItem('educationData', JSON.stringify(initialEducation));
      addEducationData(initialEducation);
    }
  }, [educationData, defaultEducationData, addEducationData]);

  const handleAddForm = useCallback(() => {
    setEducation(prev => [...prev, {
      university: '',
      major: '',
      gpa: '',
      level: '',
      graduation_date: '',
      coursework: ''
    }]);
  }, []);

  const handleSaveEducation = useCallback(() => {
    localStorage.setItem('educationData', JSON.stringify(education));
    addEducationData(education);
    toast.success('Education Added on Resume');
  }, [education, addEducationData]);

  const handleChange = useCallback((index: number, key: string, value: string) => {
    setEducation(prevEducation => {
      const updatedEducation = [...prevEducation];
      updatedEducation[index] = { ...updatedEducation[index], [key]: value };
      return updatedEducation;
    });
  }, []);

  const handleDeleteAll = useCallback(() => {
    localStorage.removeItem("educationData");
    setEducation([]);
    addEducationData([]);
  }, [addEducationData]);

  const handleDeleteEducation = useCallback((index: number) => {
    setEducation(prevEducation => {
      const updatedEducation = prevEducation.filter((_, i) => i !== index);
      localStorage.setItem('educationData', JSON.stringify(updatedEducation));
      addEducationData(updatedEducation);
      return updatedEducation;
    });
  }, [addEducationData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{data.type}</CardTitle>
          <Delete className="cursor-pointer" size={24} onClick={handleDeleteAll} />
        </div>
      </CardHeader>
      <CardContent>
        {education.map((edu, index) => (
          <form key={index}>
            <div className="grid w-full items-center gap-4 mb-5">
              <div className="flex items-center">
                <div className="flex flex-col space-y-1.5 flex-grow">
                  <div className="flex items-center justify-between">
                    <Label>University</Label>
                    <Button className="text-red-500" onClick={() => handleDeleteEducation(index)}>-</Button>
                  </div>
                  <Input
                    id={`university-${index}`}
                    placeholder="Enter university/institution name"
                    onChange={e => handleChange(index, 'university', e.target.value)}
                    value={edu.university}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Major</Label>
                  <Input
                    id={`major-${index}`}
                    placeholder="Enter your major/field of study"
                    onChange={e => handleChange(index, 'major', e.target.value)}
                    value={edu.major}
                  />
                </div>
                <div>
                  <Label>Level</Label>
                  <Input
                    id={`level-${index}`}
                    placeholder="Enter degree level (e.g., Bachelor's, Master's)"
                    onChange={e => handleChange(index, 'level', e.target.value)}
                    value={edu.level}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GPA</Label>
                  <Input
                    id={`gpa-${index}`}
                    placeholder="Enter your GPA (optional)"
                    onChange={e => handleChange(index, 'gpa', e.target.value)}
                    value={edu.gpa}
                  />
                </div>
                <div>
                  <Label>Graduation Date</Label>
                  <Input
                    placeholder="May 2024"
                    value={edu.graduation_date}
                    onChange={e => handleChange(index, 'graduation_date', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Coursework</Label>
                <Input
                  id={`coursework-${index}`}
                  placeholder="Enter relevant coursework (comma separated)"
                  onChange={e => handleChange(index, 'coursework', e.target.value)}
                  value={edu.coursework}
                />
              </div>
            </div>
            {index < education.length - 1 && <hr className="border-gray-600 mb-5" />}
          </form>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="mr-1" onClick={handleAddForm}>+1</Button>
        <Button onClick={handleSaveEducation}>Save Education</Button>
      </CardFooter>
    </Card>
  );
}
