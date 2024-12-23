"use client";

import React, { createContext, useContext, Dispatch, SetStateAction, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import type { UserCredential } from '@firebase/auth-types';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  addDoc 
} from '@firebase/firestore';
import { ProjectDataType, Skill, Experience, Education, Personal } from "@/types";

type UserData = {
  userId: string;
  score: number;
};

type Colors = {
  primary: string;
  secondary: string;
};

type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

interface ResumeData {
  personal: any[];
  education: any[];
  experience: any[];
  projects: any[];
  skills: any[];
}

export interface GlobalContextType {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  projectData: ProjectDataType[];
  addProjectData: (projects: ProjectDataType[]) => void;
  userData: UserData[];
  addUserData: (userData: UserData) => void;
  setUserData: Dispatch<SetStateAction<UserData[]>>;

  // skills
  skillsData: Skill[];
  addSkillsData: (skills: Skill[]) => void;

  // Experience
  experienceData: Experience[];
  addExperienceData: (experience: Experience[]) => void;

  // Education
  educationData: Education[];
  addEducationData: (education: Education[]) => void;

  //Personal
  personalData: Personal[];
  addPersonalData: (personal: Personal[]) => void;

  // font
  font: string;
  addFont: (font: string) => void;

  // font size
  fontSize: number;
  addFontSize: (fontSize: number) => void;

  // colors
  colors: Colors;
  addColors: (colors: Colors) => void;

  // margins
  margins: Margins;
  addMargins: (margins: Margins) => void;

  saveUserData: () => Promise<boolean>;
  user: UserCredential['user'] | null;

  // Default resume data (stored in 'resumes/default')
  defaultExperienceData: Experience[];
  defaultProjectData: ProjectDataType[];
  defaultSkillsData: Skill[];
  defaultEducationData: Education[];
  defaultPersonalData: Personal[];

  // AI-generated resume data (stored in 'resumes/ai-generated/{timestamp}')
  aiGeneratedResumes: {
    id: string;
    timestamp: number;
    jobDescription: string;
    experienceData: Experience[];
    projectData: ProjectDataType[];
    skillsData: Skill[];
    educationData: Education[];
    personalData: Personal[];
  }[];

  // Methods to manage resumes
  saveAsDefault: () => Promise<boolean>;
  saveAiGenerated: (jobDescription: string) => Promise<boolean>;
  loadDefaultResume: () => Promise<void>;
  loadAiGeneratedResume: (id: string) => Promise<void>;
  resetToDefault: () => void;

  defaultData: ResumeData | null;

  updatePersonalData: (index: number, field: string, value: string) => void;
  updateEducationData: (index: number, field: string, value: string) => void;
  updateExperienceData: (index: number, field: string, value: string) => void;
  updateProjectData: (index: number, field: string, value: string) => void;
  updateSkillsData: (index: number, field: string, value: string) => void;
}

export const GlobalContext = createContext<GlobalContextType>({
  userId: '',
  setUserId: () => {},
  projectData: [],
  addProjectData: () => {},
  userData: [],
  addUserData: () => {},
  setUserData: () => {},

  // skills
  skillsData: [],
  addSkillsData: () => {},

  // Experience
  experienceData: [],
  addExperienceData: () => {},

  // Education
  educationData: [],
  addEducationData: () => {},

  //Personal
  personalData: [],
  addPersonalData: () => {},

  // font
  font: '',
  addFont: () => {},

  // font size
  fontSize: 0,
  addFontSize: () => {},

  // colors
  colors: { primary: '#000000', secondary: '#666666' },
  addColors: () => {},

  // margins
  margins: { top: 30, right: 30, bottom: 30, left: 30 },
  addMargins: () => {},

  saveUserData: async () => false,
  user: null,

  // Default resume data (stored in 'resumes/default')
  defaultExperienceData: [],
  defaultProjectData: [],
  defaultSkillsData: [],
  defaultEducationData: [],
  defaultPersonalData: [],

  // AI-generated resume data (stored in 'resumes/ai-generated/{timestamp}')
  aiGeneratedResumes: [],

  // Methods to manage resumes
  saveAsDefault: async () => false,
  saveAiGenerated: async () => false,
  loadDefaultResume: async () => {},
  loadAiGeneratedResume: async () => {},
  resetToDefault: () => {},

  defaultData: null,

  updatePersonalData: () => {},
  updateEducationData: () => {},
  updateExperienceData: () => {},
  updateProjectData: () => {},
  updateSkillsData: () => {},
});

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
};

type GlobalContextProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [projectData, setProjectData] = useState<ProjectDataType[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [personalData, setPersonalData] = useState<Personal[]>([]);
  const [font, setFont] = useState('');
  const [fontSize, setFontSize] = useState(0);
  const [user, setUser] = useState<UserCredential['user'] | null>(null);
  const [colors, setColors] = useState<Colors>({ primary: '#000000', secondary: '#666666' });
  const [margins, setMargins] = useState<Margins>({ top: 30, right: 30, bottom: 30, left: 30 });

  // Add states for default data
  const [defaultExperienceData, setDefaultExperienceData] = useState<Experience[]>([]);
  const [defaultProjectData, setDefaultProjectData] = useState<ProjectDataType[]>([]);
  const [defaultSkillsData, setDefaultSkillsData] = useState<Skill[]>([]);
  const [defaultEducationData, setDefaultEducationData] = useState<Education[]>([]);
  const [defaultPersonalData, setDefaultPersonalData] = useState<Personal[]>([]);

  // Add states for AI-generated resumes
  const [aiGeneratedResumes, setAiGeneratedResumes] = useState<GlobalContextType['aiGeneratedResumes']>([]);

  const [defaultData, setDefaultData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserId(currentUser.uid);
        loadUserData(currentUser.uid);
      } else {
        setUserId('');
        clearLocalData();
      }
    });

    return () => unsubscribe();
  }, []);

  // Load both default and AI-generated resumes
  const loadUserData = async (uid: string) => {
    try {
      // First, try to load default resume
      const defaultDoc = await getDoc(doc(db, 'users', uid, 'resumes', 'default'));
      if (defaultDoc.exists()) {
        const defaultData = defaultDoc.data();
        
        // Set default data states
        setDefaultExperienceData(defaultData.experienceData || []);
        setDefaultProjectData(defaultData.projectData || []);
        setDefaultSkillsData(defaultData.skillsData || []);
        setDefaultEducationData(defaultData.educationData || []);
        setDefaultPersonalData(defaultData.personalData || []);

        // If no data in localStorage, use default data for all sections
        if (!localStorage.getItem('experiences')) {
          setExperienceData(defaultData.experienceData || []);
          localStorage.setItem('experiences', JSON.stringify(defaultData.experienceData || []));
        }
        if (!localStorage.getItem('projectData')) {
          setProjectData(defaultData.projectData || []);
          localStorage.setItem('projectData', JSON.stringify(defaultData.projectData || []));
        }
        if (!localStorage.getItem('skillsData')) {
          setSkillsData(defaultData.skillsData || []);
          localStorage.setItem('skillsData', JSON.stringify(defaultData.skillsData || []));
        }
        if (!localStorage.getItem('educationData')) {
          setEducationData(defaultData.educationData || []);
          localStorage.setItem('educationData', JSON.stringify(defaultData.educationData || []));
        }
        if (!localStorage.getItem('personal')) {  // Changed from 'personalData' to 'personal'
          setPersonalData(defaultData.personalData || []);
          localStorage.setItem('personal', JSON.stringify(defaultData.personalData || []));
        }
      }

      // Then load any existing current data from localStorage
      const storedExperiences = localStorage.getItem('experiences');
      if (storedExperiences) {
        setExperienceData(JSON.parse(storedExperiences));
      }
      const storedProjects = localStorage.getItem('projectData');
      if (storedProjects) {
        setProjectData(JSON.parse(storedProjects));
      }
      const storedSkills = localStorage.getItem('skillsData');
      if (storedSkills) {
        setSkillsData(JSON.parse(storedSkills));
      }
      const storedEducation = localStorage.getItem('educationData');
      if (storedEducation) {
        setEducationData(JSON.parse(storedEducation));
      }
      const storedPersonal = localStorage.getItem('personal');  // Changed from 'personalData' to 'personal'
      if (storedPersonal) {
        setPersonalData(JSON.parse(storedPersonal));
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (): Promise<boolean> => {
    if (user) {
      const userData = {
        projectData,
        skillsData,
        experienceData,
        educationData,
        personalData,
        font,
        fontSize,
      };
      try {
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log("Data saved successfully");
        return true;
      } catch (error) {
        console.error("Error saving data:", error);
        return false;
      }
    } else {
      console.warn("User not authenticated. Data not saved.");
      return false;
    }
  };

  const clearLocalData = () => {
    setProjectData([]);
    setSkillsData([]);
    setExperienceData([]);
    setEducationData([]);
    setPersonalData([]);
    // Clear local storage
    localStorage.clear();
  };

  const updateLocalStorage = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  };

  const addProjectData = (projects: ProjectDataType[]) => {
    setProjectData(projects);
    localStorage.setItem('projectData', JSON.stringify(projects));
    saveUserData();
  };

  const addUserData = (userDataItem: UserData) => {
    setUserData((prevData) => [...prevData, userDataItem]);
    localStorage.setItem('userData', JSON.stringify([...userData, userDataItem]));
  };

  const addSkillsData = (skills: Skill[]) => {
    setSkillsData(skills);
    localStorage.setItem('skillsData', JSON.stringify(skills));
    saveUserData();
  };

  const addExperienceData = (experience: Experience[]) => {
    setExperienceData(experience);
    localStorage.setItem('experienceData', JSON.stringify(experience));
    saveUserData();
  };

  const addEducationData = (education: Education[]) => {
    setEducationData(education);
    localStorage.setItem('educationData', JSON.stringify(education));
    saveUserData();
  };

  const addPersonalData = (personal: Personal[]) => {
    setPersonalData(personal);
    localStorage.setItem('personalData', JSON.stringify(personal));
    saveUserData();
  };

  const addFont = (font: string) => {
    setFont(font);
    localStorage.setItem('font', JSON.stringify(font));
  };

  const addFontSize = (fontSize: number) => {
    setFontSize(fontSize);
    localStorage.setItem('fontSize', JSON.stringify(fontSize));
  };

  const addColors = (newColors: Colors) => {
    setColors(newColors);
    localStorage.setItem('colors', JSON.stringify(newColors));
  };

  const addMargins = (newMargins: Margins) => {
    setMargins(newMargins);
    localStorage.setItem('margins', JSON.stringify(newMargins));
  };

  // Save current state as default resume
  const saveAsDefault = async (): Promise<boolean> => {
    if (!user) return false;

    const defaultData = {
      experienceData,
      projectData,
      skillsData,
      educationData,
      personalData,
      updatedAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'users', user.uid, 'resumes', 'default'), defaultData);
      
      // Update default states
      setDefaultExperienceData(experienceData);
      setDefaultProjectData(projectData);
      setDefaultSkillsData(skillsData);
      setDefaultEducationData(educationData);
      setDefaultPersonalData(personalData);
      
      return true;
    } catch (error) {
      console.error('Error saving default resume:', error);
      return false;
    }
  };

  // Save AI-generated resume
  const saveAiGenerated = async (jobDescription: string): Promise<boolean> => {
    if (!user) return false;

    const aiGeneratedData = {
      experienceData,
      projectData,
      skillsData,
      educationData,
      personalData,
      jobDescription,
      timestamp: Date.now()
    };

    try {
      const docRef = await addDoc(
        collection(db, 'users', user.uid, 'resumes', 'ai-generated'), 
        aiGeneratedData
      );
      
      setAiGeneratedResumes(prev => [...prev, { id: docRef.id, ...aiGeneratedData }]);
      return true;
    } catch (error) {
      console.error('Error saving AI-generated resume:', error);
      return false;
    }
  };

  // Load a specific AI-generated resume
  const loadAiGeneratedResume = async (id: string): Promise<void> => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'resumes', 'ai-generated', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setExperienceData(data.experienceData || []);
        setProjectData(data.projectData || []);
        setSkillsData(data.skillsData || []);
        setEducationData(data.educationData || []);
        setPersonalData(data.personalData || []);
      }
    } catch (error) {
      console.error('Error loading AI-generated resume:', error);
    }
  };

  // Load default resume
  const loadDefaultResume = async (): Promise<void> => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'resumes', 'default');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Set experience data
        setExperienceData(data.experienceData || []);
        localStorage.setItem('experiences', JSON.stringify(data.experienceData || []));

        // Set project data
        setProjectData(data.projectData || []);
        localStorage.setItem('projectData', JSON.stringify(data.projectData || []));

        // Set skills data
        setSkillsData(data.skillsData || []);
        localStorage.setItem('skillsData', JSON.stringify(data.skillsData || []));

        // Set education data
        setEducationData(data.educationData || []);
        localStorage.setItem('educationData', JSON.stringify(data.educationData || []));

        // Set personal data
        setPersonalData(data.personalData || []);
        localStorage.setItem('personal', JSON.stringify(data.personalData || []));

        // Update all states at once
        updateLocalStorage({
          experiences: data.experienceData || [],
          projectData: data.projectData || [],
          skillsData: data.skillsData || [],
          educationData: data.educationData || [],
          personal: data.personalData || []
        });
      }
    } catch (error) {
      console.error('Error loading default resume:', error);
    }
  };

  // Reset current resume to default
  const resetToDefault = () => {
    setExperienceData([...defaultExperienceData]);
    setProjectData([...defaultProjectData]);
    setSkillsData([...defaultSkillsData]);
    setEducationData([...defaultEducationData]);
    setPersonalData([...defaultPersonalData]);
  };

  const updatePersonalData = (index: number, field: string, value: string) => {
    const updated = [...personalData];
    updated[index] = { ...updated[index], [field]: value };
    addPersonalData(updated);
  };

  const updateEducationData = (index: number, field: string, value: string) => {
    const updated = [...educationData];
    updated[index] = { ...updated[index], [field]: value };
    addEducationData(updated);
  };

  const updateExperienceData = (index: number, field: string, value: string) => {
    const updated = [...experienceData];
    updated[index] = { ...updated[index], [field]: value };
    addExperienceData(updated);
  };

  const updateProjectData = (index: number, field: string, value: string) => {
    const updated = [...projectData];
    updated[index] = { ...updated[index], [field]: value };
    addProjectData(updated);
  };

  const updateSkillsData = (index: number, field: string, value: string) => {
    const updated = [...skillsData];
    updated[index] = { ...updated[index], [field]: value };
    addSkillsData(updated);
  };

  return (
    <GlobalContext.Provider value={{ 
      userId, setUserId, projectData, addProjectData, userData, addUserData, setUserData,
      skillsData, addSkillsData, experienceData, addExperienceData, educationData, addEducationData,
      personalData, addPersonalData, font, addFont, fontSize, addFontSize, saveUserData, user,
      colors, addColors, margins, addMargins,
      defaultExperienceData,
      defaultProjectData,
      defaultSkillsData,
      defaultEducationData,
      defaultPersonalData,
      aiGeneratedResumes,
      saveAsDefault,
      saveAiGenerated,
      loadDefaultResume,
      loadAiGeneratedResume,
      resetToDefault,
      defaultData,
      updatePersonalData,
      updateEducationData,
      updateExperienceData,
      updateProjectData,
      updateSkillsData,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
