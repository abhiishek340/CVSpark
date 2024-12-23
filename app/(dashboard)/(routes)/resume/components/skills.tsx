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
import type { Skill } from "@/types";

interface SkillsProps {
  data: {
    type: string;
  };
}

const emptySkill: Skill = {
  category: '',
  items: []
};

export function Skills({ data }: SkillsProps) {
  const { 
    addSkillsData, 
    skillsData,
    defaultSkillsData 
  } = useGlobalContext();

  const [skills, setSkills] = useState<Skill[]>([emptySkill]);

  useEffect(() => {
    const storedSkills = localStorage.getItem('skillsData');
    
    if (skillsData.length > 0) {
      setSkills(skillsData);
    } else if (storedSkills) {
      setSkills(JSON.parse(storedSkills));
    } else if (defaultSkillsData.length > 0) {
      setSkills(defaultSkillsData);
      localStorage.setItem('skillsData', JSON.stringify(defaultSkillsData));
      addSkillsData(defaultSkillsData);
    } else {
      const initialSkill = [{
        category: '',
        items: []
      }];
      setSkills(initialSkill);
      localStorage.setItem('skillsData', JSON.stringify(initialSkill));
      addSkillsData(initialSkill);
    }
  }, [skillsData, defaultSkillsData, addSkillsData]);

  const handleAddForm = useCallback(() => {
    setSkills(prev => [...prev, emptySkill]);
  }, []);

  const handleSaveSkills = useCallback(() => {
    localStorage.setItem('skillsData', JSON.stringify(skills));
    addSkillsData(skills);
    toast.success('Skills Added on Resume');
  }, [skills, addSkillsData]);

  const handleChange = useCallback((index: number, field: keyof Skill, value: string) => {
    setSkills(prevSkills => {
      const updatedSkills = [...prevSkills];
      if (field === 'items') {
        updatedSkills[index] = { ...updatedSkills[index], items: value.split(',').map(item => item.trim()) };
      } else {
        updatedSkills[index] = { ...updatedSkills[index], [field]: value };
      }
      return updatedSkills;
    });
  }, []);

  const handleDeleteAll = useCallback(() => {
    localStorage.removeItem("skillsData");
    setSkills([]);
    addSkillsData([]);
  }, [addSkillsData]);

  const handleDeleteSkill = useCallback((index: number) => {
    setSkills(prevSkills => {
      const updatedSkills = prevSkills.filter((_, i) => i !== index);
      localStorage.setItem('skillsData', JSON.stringify(updatedSkills));
      addSkillsData(updatedSkills);
      return updatedSkills;
    });
  }, [addSkillsData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{data.type}</CardTitle>
          <Delete className="cursor-pointer" size={24} onClick={handleDeleteAll} />
        </div>
      </CardHeader>
      <CardContent>
        {skills.map((skill, index) => (
          <form key={index}>
            <div className="grid w-full items-center gap-4 mb-5">
              <div className="flex items-center">
                <div className="flex flex-col space-y-1.5 flex-grow">
                  <div className="flex items-center justify-between">
                    <Label>Category</Label>
                    <Button className="text-red-500" onClick={() => handleDeleteSkill(index)}>-</Button>
                  </div>
                  <Input
                    placeholder="Python, Java, JavaScript, C++, SQL"
                    value={skill.category}
                    onChange={e => handleChange(index, 'category', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Items</Label>
                <Input
                  placeholder="React, Node.js, Django, Spring Boot"
                  value={skill.items.join(',')}
                  onChange={e => handleChange(index, 'items', e.target.value)}
                />
              </div>
            </div>
            {index < skills.length - 1 && <hr className="border-gray-600 mb-5" />}
          </form>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="mr-1" onClick={handleAddForm}>+1</Button>
        <Button onClick={handleSaveSkills}>Save Skills</Button>
      </CardFooter>
    </Card>
  );
}
