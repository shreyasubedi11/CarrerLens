export const ResumeAnalyserPrompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume
and provide:
1. An ATS compatibility score (0-100)
2. Detailed suggestions to improve the resume for better ATS performance

Your entire response must be in valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.

The JSON object should have the following structure:
{
  "atsScore": 85,
  "scoreBreakdown": {
    "formatting":  { "score": 90, "feedback": "Brief feedback on formatting" },
    "keywords":    { "score": 80, "feedback": "Brief feedback on keyword usage" },
    "structure":   { "score": 85, "feedback": "Brief feedback on resume structure" },
    "readability": { "score": 88, "feedback": "Brief feedback on readability" }
  },
  "suggestions": [
    {
      "category":       "Category name (e.g., Formatting, Content, Keywords, Structure)",
      "issue":          "Description of the issue found",
      "recommendation": "Specific actionable recommendation to fix it",
      "priority":       "high/medium/low"
    }
  ],
  "strengths": ["List of things the resume does well for ATS"],
  "summary":   "A brief 2-3 sentence summary of the overall ATS performance"
}

Focus on: file format and structure compatibility, proper use of standard section headings,
keyword optimization, formatting issues (tables, columns, graphics, special characters),
contact information placement, date formatting, use of action verbs and quantifiable
achievements, section organization and flow.
`;

export const JobMatcherPrompt = (
  mode: string,
  skills?: string[],
  experience?: string
) => `
You are an expert career counselor and job market analyst.
${
  mode === "manual"
    ? `The candidate has these skills: ${skills?.join(
        ", "
      )}\nExperience: ${experience}`
    : "Analyze the attached resume to extract skills and experience."
}
 
Based on this profile, suggest the 5 best matching job roles.
 
Respond ONLY in valid JSON with this exact structure:
{
  "summary": "2-3 sentence overview of the candidate profile and job market fit",
  "jobs": [
    {
      "title": "Job title",
      "company": "Type of company that typically hires this (e.g. 'Startups', 'MNCs', 'Product companies')",
      "matchScore": 85,
      "location": "Remote / Hybrid / On-site",
      "type": "Full-time / Freelance / Contract",
      "skills": ["skill1", "skill2", "skill3"],
      "whyMatch": "Why this role suits the candidate based on their profile",
      "applyTip": "One specific actionable tip to improve their chances of getting this role"
    }
  ]
}
`;

export const buildResumePrompt = (mode: string, formData?: any) => `
You are an expert resume writer and ATS optimization specialist.
${
  mode === "manual"
    ? `Build a professional, ATS-optimized resume using this information:
${JSON.stringify(formData, null, 2)}`
    : "Extract all information from the attached resume and rewrite it to be highly ATS-optimized, professional, and impactful."
}
 
Return ONLY valid JSON with this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, Country",
  "linkedin": "linkedin url or empty string",
  "summary": "3-4 sentence powerful professional summary optimized for ATS",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "bullets": [
        "Achievement-focused bullet with action verb and quantifiable result",
        "Another strong bullet point"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "Institution Name",
      "location": "City, Country",
      "year": "Graduation Year",
      "gpa": "GPA if provided or empty string"
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "2-3 sentence ATS-optimized description with technologies used and impact",
      "link": "project link or empty string"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"]
}
 
ATS Rules to follow:
- Use standard section headings
- Include relevant keywords naturally
- Start each bullet with a strong action verb
- Quantify achievements wherever possible
- Keep language clean, no tables or special characters
- If any field has no data, use empty array or empty string
`;

export const generateInterviewPrompt = (
  round: string,
  mode: string,
  skills?: string,
  experience?: string
) => `
You are an expert ${
  round === "hr" ? "HR interviewer" : "Senior Technical Interviewer"
}.
${
  mode === "manual"
    ? `The candidate has these skills: ${skills}\nBackground: ${experience}`
    : "Analyze the attached resume to understand the candidate's profile."
}
 
Generate a realistic ${
  round === "hr" ? "HR behavioral" : "technical"
} interview question set.
 
Return ONLY valid JSON:
{
  "role": "Inferred or likely job role",
  "round": "${round}",
  "questions": [
    {
      "id": 1,
      "question": "The interview question",
      "hint": "What a good answer should cover (1 sentence)",
      "category": "${
        round === "hr"
          ? "Behavioral/Situational/Cultural Fit"
          : "DSA/System Design/Language/Framework/Concepts"
      }"
    }
  ]
}
 
Rules:
- Generate exactly 10 questions
- ${
  round === "hr"
    ? "Focus on teamwork, conflict, leadership, goals, strengths/weaknesses, culture fit"
    : "Focus on the candidate's specific tech stack, DSA, system design relevant to their level"
}
- Questions should progressively get harder
- Keep questions realistic and commonly asked in actual interviews
`;
