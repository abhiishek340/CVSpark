import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Warning: NEXT_PUBLIC_GEMINI_API_KEY is not defined');
}

export const generateTailoredContent = async (resumeData: any, jobDescription: string) => {
  try {
    if (!GEMINI_API_KEY) {
      return {
        experiences: resumeData.experiences,
        projects: resumeData.projects,
      };
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an expert resume tailoring AI. Your task is to create a tailored resume based on the following information:
    
    Existing Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Job Description:
    ${jobDescription}
    
    Instructions:
    Please analyze the provided job description and transform my resume using these detailed instructions:
    
    ANALYSIS PHASE:
    1. Extract and list all:
       - Required technical skills
       - Required soft skills
       - Key responsibilities
       - Industry-specific keywords
       - Tools/technologies mentioned
       - Preferred qualifications
    
    2. Company Research:
       - Identify the company's main business domain
       - Understand core products/services
       - Note typical roles and responsibilities for the position in this specific company
    
    EXPERIENCE TAILORING RULES:
    1. Company-Specific Logic:
       - For well-known companies (FAANG, Fortune 500, etc.):
         * Only include achievements that align with the company's known business domains
         * Focus on department-specific accomplishments
         * Maintain realistic scope of responsibilities
       - For other companies:
         * Align experience with industry standards for the role
         * Focus on transferable skills relevant to the position
    
    2. Experience Constraints:
       - DO NOT transfer experiences between different roles/companies
       - Each position should only contain achievements actually accomplished in that role
       - For each company, research their core business and ensure experiences align with:
         * Company's primary business domain
         * Department's typical responsibilities
         * Role's standard scope
       - When enhancing experiences, maintain:
         * Technological relevance to the time period
         * Company's scale and scope
         * Industry-specific constraints
    
    EXPERIENCE GENERATION (3 positions):
    1. For each position, create:
       - A role title that closely mirrors the target position while staying within the original role's scope
       - DO NOT change the company names or GitHub links
       - Do not start bullet points with a hyphen (-). Instead, use complete sentences
       - 4-5 achievement-focused bullet points that must:
         * Stay within the realm of that specific company's business domain
         * Use technologies/tools that were available during the employment period
         * Match the scale and scope of the company
         * Include realistic metrics for that company's size and industry
         * Each bullet needs to be detailed and very specific to the company and role with complete sentences
         * Lead with powerful action verbs
         * Do not forget to include quantifiable metrics with a %, time, cost, scale, team size, project budget, business value delivered
         * Demonstrate problem-solving using the STAR method
         * Incorporate relevant technical skills from the job description
         * Show leadership/collaboration abilities appropriate for that role's level
    
    PROJECT SHOWCASE (3 projects):
    [Previous project showcase section remains the same]
    
    VALIDATION CHECKS:
    1. Company-Specific Validation:
       - Verify each bullet point against:
         * Company's actual business domain
         * Department's typical scope
         * Role's reasonable responsibilities
         * Timeline-appropriate technologies
         * Realistic metrics for company size/industry
    
    2. Cross-reference each bullet point against:
       - Job requirements alignment
       - Technical accuracy
       - Quantifiable impact
       - Keyword presence
       - Action verb strength
       - Logical consistency with the role and company
    
    3. Reality Check:
       - Would this achievement be possible at this company?
       - Is the scale appropriate for the company size?
       - Were the mentioned technologies available during the employment period?
       - Does the responsibility level match the role's seniority?
    
    [Rest of the formatting guidelines and JSON output format remain the same]
    
    Important Additional Rules:
    1. Never mix experiences between different companies
    2. Ensure all achievements are logically possible within each company's context
    3. Must include quantifiable metrics with a %, time, cost, scale, team size, project budget, business value delivered
    4. Each bullet needs to be very strong specific and very impactful in the context of the company
    5. Maintain chronological consistency with technology usage
    6. Keep metrics and impact claims proportional to company size and industry
    7. Do not insert extra newline characters between bullet points
    8. Do not include empty bullet points or lines with only a bullet character
    9. Ensure each bullet point contains meaningful content specific to that role

PROJECT SHOWCASE (3 projects):
1. For each project, include:
   - Project title that highlights the primary technology/solution
   - DO NOT change the GitHub links. Use the original data for these fields.
   - Do not start bullet points with a hyphen (-). Instead, use complete sentences.
   - 3-4 technical bullet points that must:
     * Demonstrate hands-on experience with required technologies
     * Show end-to-end project ownership
     * Include specific technical challenges overcome
     * Quantify impact (e.g., performance improvements, user adoption)
     * Match the technical stack mentioned in the job description

FORMATTING GUIDELINES:
1. Bullet Point Structure:
   - Start with: [Strong Action Verb] + [Technical Skill/Tool] + [Purpose/Challenge]
   - Middle: [Specific Actions/Implementation Details]
   - End: [Quantifiable Results/Business Impact]

2. Technical Depth:
   - Include specific versions of technologies used
   - Mention methodologies/frameworks implemented
   - Detail system architecture decisions
   - Specify performance optimizations

3. Keywords Integration:
   - Naturally incorporate at least 80% of the technical keywords from the job description
   - Use industry-standard terminology
   - Include relevant certifications and tools

ACHIEVEMENT METRICS:
Ensure each bullet point has at least one of these elements:
- Percentage improvement
- Time/cost savings
- Scale of impact (users/transactions/data volume)
- Team size managed
- Project budget
- Business value delivered

VALIDATION CHECKS:
1. Cross-reference each bullet point against:
   - Job requirements alignment
   - Technical accuracy
   - Quantifiable impact
   - Keyword presence
   - Action verb strength

2. Ensure all experience entries:
   - Demonstrate progression in responsibility
   - Show relevant technology adoption
   - Highlight cross-functional collaboration
   - Emphasize problem-solving abilities

Important: 
1. Do not insert extra newline characters between bullet points. 
2. Each bullet point should be a single line of text.
3. Do not include empty bullet points or lines with only a bullet character.
4. Ensure each bullet point contains meaningful content.

Provide the output in the following JSON format:
{
  "experiences": [
    {
      "title": "string",
      "company": "string (use original company name)",
      "start_date": "string (MMM YYYY format) (important : use original start date)",
      "end_date": "string (MMM YYYY format or 'Present')( important: use original end date)",
      "detailed_experience": "string (4-5 bullet points, each as a complete sentence, separated by a single newline character, no empty lines)",
      "isEndPresent": boolean
    },
    // Two more experience object
  ],
  "projects": [
    {
      "name": "string",
      "language": "string (main technologies used)",
      "description": "string (3-4 bullet points, each as a complete sentence, separated by a single newline character, no empty lines)",
      "github": "string (use original GitHub link)"
    },
    // Two more project objects
  ]
}

Ensure that the output is a valid JSON object with no additional text or formatting. The 'detailed_experience' and 'description' fields must contain multiple bullet points as complete sentences, separated by a single newline character without any extra empty lines or standalone bullet characters.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove markdown code blocks if present
    text = text.replace(/```json\n|\n```/g, '').trim();
    
    // Parse the JSON string
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      throw new Error("Invalid JSON response from AI model");
    }
    
    // Validate the structure of the parsed data
    if (!parsedData.experiences || !Array.isArray(parsedData.experiences) || 
        !parsedData.projects || !Array.isArray(parsedData.projects)) {
      console.error("Invalid data structure:", parsedData);
      throw new Error("Invalid data structure in AI response");
    }
    
    if (parsedData.experiences.length !== 3 || parsedData.projects.length !== 3) {
      console.error("Incorrect number of experiences or projects:", parsedData);
      throw new Error("Incorrect number of experiences or projects in AI response");
    }
    
    // Ensure each experience and project has detailed content and original company names/GitHub links
    parsedData.experiences = parsedData.experiences.map((exp: any, index: number) => ({
      ...exp,
      company: resumeData.experiences[index]?.company || exp.company,
      detailed_experience: exp.detailed_experience || "No detailed experience provided. Please update with relevant information."
    }));

    parsedData.projects = parsedData.projects.map((proj: any, index: number) => ({
      ...proj,
      github: resumeData.projects[index]?.github || proj.github,
      description: proj.description || "No project description available. Please update with project details."
    }));

    // Add this function to clean up the generated content
    const cleanupContent = (content: any) => {
      if (content.experiences) {
        content.experiences = content.experiences.map((exp: any) => ({
          ...exp,
          detailed_experience: exp.detailed_experience
            .split('\n')
            .filter((line: string) => line.trim() !== '' && line.trim() !== '•')
            .join('\n')
        }));
      }
      if (content.projects) {
        content.projects = content.projects.map((proj: any) => ({
          ...proj,
          description: proj.description
            .split('\n')
            .filter((line: string) => line.trim() !== '' && line.trim() !== '•')
            .join('\n')
        }));
      }
      return content;
    };

    // Clean up the parsed data before returning
    parsedData = cleanupContent(parsedData);

    return parsedData;
  } catch (error) {
    console.error('Error generating content:', error);
    return {
      experiences: resumeData.experiences,
      projects: resumeData.projects,
    };
  }
};
