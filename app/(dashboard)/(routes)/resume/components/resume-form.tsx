import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

import { Experience } from "./experience"
import { Projects } from "./projects"
import { Education } from "./education"
import { Info } from "./info"
import { Skills } from "./skills"
import LayoutTools from "./LayoutTools"
import { JobDescriptionInput } from "./job-description-input"
import { JobSearch } from "./job-search"  // Add this import
import { generateTailoredContent } from "@/lib/gemini-service"
import { useGlobalContext } from "@/context/global-context"
import { DefaultDataButtons } from './DefaultDataButtons';

export function ResumeForm() {

    const formSchema = z.object({
        username: z.string().min(2, {
          message: "Username must be at least 2 characters.",
        }),
        email: z.string().email({
          message: "Please enter a valid email address.",
        }),
        address: z.string(), // Add address field validation
        website: z.string().url(), // Add website field validation
        github: z.string(), // Add GitHub field validation
        phoneNumber: z.string(), // Add phone number field validation
        linkedin: z.string(), // Add LinkedIn field validation
        university: z.string(),
        level: z.string(),
        gpa: z.string(),
        graduation: z.string(),
        coursework: z.string(),

    })

    type ResumeFormValues = z.infer<typeof formSchema>;
      
    const form = useForm<ResumeFormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (values: ResumeFormValues) => {
        console.log(values);
    }

    const { 
        projectData, 
        experienceData, 
        addProjectData, 
        addExperienceData,
        personalData,
        educationData,
        skillsData,
    } = useGlobalContext();

    const handleJobDescriptionSubmit = async (jobDescription: string) => {
        const resumeData = {
            projects: projectData,
            experiences: experienceData,
            personal: personalData,
            education: educationData,
            skills: skillsData,
        };

        try {
            const tailoredContent = await generateTailoredContent(resumeData, jobDescription);
            
            console.log("AI-generated content:", JSON.stringify(tailoredContent, null, 2));

            // Update the state with the tailored content, but don't save to Firebase
            addExperienceData(tailoredContent.experiences);
            addProjectData(tailoredContent.projects);

            toast.success('Resume tailored successfully. Review and edit as needed before saving.');
        } catch (error) {
            console.error("Error generating tailored content:", error);
            if (error instanceof Error) {
                toast.error(`Failed to tailor resume: ${error.message}`);
            } else {
                toast.error('An unexpected error occurred while tailoring the resume');
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
        >
            <DefaultDataButtons />
            <Info data={{ type: "Personal Info" }}/>  
            <Education data={{ type: "Education" }}/>
            <Experience data={{ type: "Experience" }}/>
            <Projects data={{ type: "Projects" }}/>
            <Skills data={{ type: "Skills" }}/>
            <JobDescriptionInput onSubmit={handleJobDescriptionSubmit} />
            <JobSearch />  {/* Add the JobSearch component here */}
            <LayoutTools />
        </motion.div>
    )
}
