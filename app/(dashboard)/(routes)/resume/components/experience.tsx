import * as React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";
import { useGlobalContext } from '@/context/global-context';
import DatePicker from "./datepicker";
import { Delete } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Experience } from "@/types";

interface ExperienceProps {
  data: {
    type: string;
  };
}

const emptyExperience: Experience = {
  title: '',
  company: '',
  position: '',
  start_date: '',
  end_date: '',
  description: [],
  detailed_experience: '',
  location: '',
  isEndPresent: false
};

export function Experience({ data }: ExperienceProps) {
  const { 
    addExperienceData,
    experienceData,
    defaultExperienceData 
  } = useGlobalContext();

  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Load experiences from either experienceData, localStorage, or defaultExperienceData
  useEffect(() => {
    const storedExperiences = localStorage.getItem('experiences');
    
    if (experienceData.length > 0) {
      setExperiences(experienceData);
    } else if (storedExperiences) {
      setExperiences(JSON.parse(storedExperiences));
    } else if (defaultExperienceData.length > 0) {
      setExperiences(defaultExperienceData);
      localStorage.setItem('experiences', JSON.stringify(defaultExperienceData));
      addExperienceData(defaultExperienceData);
    } else {
      setExperiences([emptyExperience]);
      localStorage.setItem('experiences', JSON.stringify([emptyExperience]));
      addExperienceData([emptyExperience]);
    }
  }, [experienceData, defaultExperienceData, addExperienceData]);

  const handleAddForm = useCallback(() => {
    setExperiences(prev => [...prev, emptyExperience]);
  }, []);

  const handleSaveExperience = useCallback(() => {
    localStorage.setItem('experiences', JSON.stringify(experiences));
    addExperienceData(experiences);
    toast.success('Experience Added on Resume');
  }, [experiences, addExperienceData]);

  const handleChange = useCallback((index: number, key: string, value: string | Date) => {
    setExperiences(prevExperiences => {
      const updatedExperiences = [...prevExperiences];
      if (key === 'start_date' || key === 'end_date') {
        const date = new Date(value as string);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        updatedExperiences[index] = { ...updatedExperiences[index], [key]: formattedDate };
      } else {
        updatedExperiences[index] = { ...updatedExperiences[index], [key]: value };
      }
      return updatedExperiences;
    });
  }, []);

  const handleCheckboxChange = useCallback((index: number) => {
    setExperiences(prevExperiences => {
      const updatedExperiences = [...prevExperiences];
      if (index >= 0 && index < updatedExperiences.length) {
        const isEndPresent = !updatedExperiences[index].isEndPresent;
        updatedExperiences[index] = {
          ...updatedExperiences[index],
          isEndPresent,
          end_date: isEndPresent ? 'Present' : ''
        };
      }
      return updatedExperiences;
    });
  }, []);

  const handleDeleteAll = useCallback(() => {
    localStorage.removeItem("experiences");
    setExperiences([]);
    addExperienceData([]);
  }, [addExperienceData]);

  const handleDeleteExperience = useCallback((index: number) => {
    setExperiences(prevExperiences => {
      const updatedExperiences = prevExperiences.filter((_, i) => i !== index);
      localStorage.setItem('experiences', JSON.stringify(updatedExperiences));
      addExperienceData(updatedExperiences);
      return updatedExperiences;
    });
  }, [addExperienceData]);

  return (
    <Card className="grid-cols-2 gap-x-4 gap-y-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{data.type}</CardTitle>
          <Delete className="cursor-pointer" size={24} onClick={handleDeleteAll} />
        </div>
      </CardHeader>
      <CardContent>
        {experiences.map((experience, index) => (
          <form key={index}>
            <div className="grid w-full items-center gap-4 mb-5">
              <div className="flex items-center">
                <div className="flex flex-col space-y-1.5 flex-grow">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`name-${index}`}>Title</Label>
                    <Button className="text-red-500" onClick={() => handleDeleteExperience(index)}>-</Button>
                  </div>
                  <Input 
                    className="w-full"
                    id={`title-${index}`}
                    placeholder="Software Engineering Intern"
                    onChange={e => handleChange(index, 'title', e.target.value)}
                    value={experience.title}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2">
                <div>
                  <Label htmlFor={`company-name-${index}`}>Company Name</Label>
                  <Input
                    id={`company-name-${index}`}
                    placeholder="Enter company name"
                    onChange={e => handleChange(index, 'company', e.target.value)}
                    value={experience.company}
                  />
                </div>

                <div className="flex flex-col justify-center gap-1 ml-auto">
                  <Label htmlFor={`date-${index}`}>Start Date</Label>
                  <DatePicker
                    selectedDate={experience.start_date}
                    onSelectDate={date => handleChange(index, 'start_date', date as any)}
                  />
                </div>

                <div className="flex gap-5">
                  <div>
                    <Label htmlFor={`date-${index}`}>End Date</Label>
                    <DatePicker
                      selectedDate={experience.end_date === 'Present' ? undefined : experience.end_date}
                      onSelectDate={(date) => handleChange(index, 'end_date', date as any)}
                      disabled={experience.isEndPresent}
                    />
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id={`present-${index}`}
                      checked={experience.isEndPresent}
                      onCheckedChange={() => handleCheckboxChange(index)}
                    />
                    <Label htmlFor={`present-${index}`} className="ml-2">Present</Label>
                  </div>
                </div>
              </div>

              <Label htmlFor="experiences">Detailed Experiences</Label>
              <Textarea
                id={`experiences-${index}`}
                placeholder="Describe your key responsibilities, achievements, and the impact of your work. Use bullet points for better readability."
                onChange={e => handleChange(index, 'detailed_experience', e.target.value)}
                value={experience.detailed_experience}
              />
            </div>
            {index < experiences.length - 1 && <hr className="border-gray-600 mb-5" />}
          </form>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="mr-1" onClick={handleAddForm}>+1</Button>
        <Button onClick={handleSaveExperience}>Save Experience</Button>
      </CardFooter>
    </Card>
  );
}
