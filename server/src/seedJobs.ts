import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Company from "./models/Company.js";
import job from "./models/Job.js";
import SavedJob from "./models/SavedJob.js";
import Appointment from "./models/Appointment.js";
import User from "./models/User.js";

dotenv.config();
await connectDB();

// DEMO DATA: made-up companies for a university project
await Company.deleteMany({});
const companies: any[] = await Company.insertMany([
  {
    name: "Himalayan Soft",
    location: "Pokhara",
    website: "https://example.com",
    description: "Product company building SaaS tools for tourism businesses.",
    size: "51-200 employees",
  },
  {
    name: "TechNepal Pvt. Ltd.",
    location: "Kathmandu",
    website: "https://example.com",
    description: "Software house working on web and mobile apps for banks.",
    size: "51-200 employees",
  },
  {
    name: "Pixel Studio",
    location: "Lalitpur",
    website: "https://example.com",
    description: "Design-first agency for startups.",
    size: "11-50 employees",
  },
  {
    name: "CodeMandu",
    location: "Kathmandu",
    website: "https://example.com",
    description: "Remote-friendly MERN stack team.",
    size: "11-50 employees",
  },
  {
    name: "DataBridge Nepal",
    location: "Remote",
    website: "https://example.com",
    description: "Data engineering and analytics consultancy.",
    size: "11-50 employees",
  },
  {
    name: "Everest Systems",
    location: "Biratnagar",
    website: "https://example.com",
    description: "IT services and quality assurance.",
    size: "201-500 employees",
  },
]);

const himalayan = companies[0];
const technepal = companies[1];
const pixel = companies[2];
const codemandu = companies[3];
const databridge = companies[4];
const everest = companies[5];

await SavedJob.deleteMany({});
await Appointment.deleteMany({});
await User.updateMany({}, { $set: { bookedJobs: [] } } as any);
await job.deleteMany({});

await job.insertMany([
  // TechNepal: some open, one filled
  {
    company: technepal._id,
    title: "Frontend Developer (React)",
    category: "Frontend",
    type: "Full-time",
    mode: "Hybrid",
    salary: "Rs. 50,000 - 70,000",
    description: "Build responsive web apps with React and TypeScript.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Git"],
    openings: 2,
    status: "Open",
  },
  {
    company: technepal._id,
    title: "Backend Developer (Java)",
    category: "Backend",
    type: "Full-time",
    mode: "On-site",
    salary: "Rs. 70,000 - 90,000",
    description: "Maintain banking services in Java and Spring.",
    skills: ["Java", "Spring Boot", "SQL", "REST API"],
    openings: 1,
    status: "Filled",
  },
  {
    company: technepal._id,
    title: "Machine Learning Intern",
    category: "Data/AI",
    type: "Internship",
    mode: "On-site",
    salary: "Rs. 20,000",
    description: "Help train and test ML models.",
    skills: ["Python", "Machine Learning", "NumPy", "Pandas"],
    openings: 1,
    status: "Open",
  },

  // CodeMandu: all open
  {
    company: codemandu._id,
    title: "Full Stack Developer (MERN)",
    category: "Full Stack",
    type: "Full-time",
    mode: "Remote",
    salary: "Rs. 80,000 - 110,000",
    description: "Own features end to end across the MERN stack.",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    openings: 3,
    status: "Open",
  },
  {
    company: codemandu._id,
    title: "Junior Frontend Developer",
    category: "Frontend",
    type: "Full-time",
    mode: "Remote",
    salary: "Rs. 35,000 - 50,000",
    description: "Work with senior devs to build UI components.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    openings: 1,
    status: "Open",
  },

  // Himalayan Soft
  {
    company: himalayan._id,
    title: "Backend Developer (Node.js)",
    category: "Backend",
    type: "Full-time",
    mode: "On-site",
    salary: "Rs. 60,000 - 80,000",
    description: "Design REST APIs and work with MongoDB.",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    openings: 2,
    status: "Open",
  },
  {
    company: himalayan._id,
    title: "Full Stack Intern",
    category: "Full Stack",
    type: "Internship",
    mode: "On-site",
    salary: "Rs. 15,000",
    description: "Learn and contribute across frontend and backend.",
    skills: ["JavaScript", "React", "Node.js", "Git"],
    openings: 2,
    status: "Open",
  },

  // DataBridge
  {
    company: databridge._id,
    title: "Python Backend Developer",
    category: "Backend",
    type: "Contract",
    mode: "Remote",
    salary: "Rs. 70,000",
    description: "Build APIs and data pipelines in Python.",
    skills: ["Python", "Django", "SQL", "Docker"],
    openings: 1,
    status: "Open",
  },
  {
    company: databridge._id,
    title: "Data Analyst",
    category: "Data/AI",
    type: "Full-time",
    mode: "Remote",
    salary: "Rs. 55,000 - 75,000",
    description: "Analyze business data and build dashboards.",
    skills: ["Python", "SQL", "Pandas", "Power BI"],
    openings: 1,
    status: "Open",
  },

  // Pixel Studio: ALL FILLED
  {
    company: pixel._id,
    title: "Frontend Developer (Vue)",
    category: "Frontend",
    type: "Contract",
    mode: "On-site",
    salary: "Rs. 45,000",
    description: "Convert Figma designs into Vue apps.",
    skills: ["Vue", "JavaScript", "CSS", "Figma"],
    openings: 1,
    status: "Filled",
  },
  {
    company: pixel._id,
    title: "UI/UX Designer",
    category: "UI/UX",
    type: "Full-time",
    mode: "Hybrid",
    salary: "Rs. 45,000 - 65,000",
    description: "Design interfaces from research to prototype.",
    skills: ["Figma", "UI Design", "Prototyping", "User Research"],
    openings: 1,
    status: "Filled",
  },
  {
    company: pixel._id,
    title: "UI/UX Design Intern",
    category: "UI/UX",
    type: "Internship",
    mode: "On-site",
    salary: "Rs. 15,000",
    description: "Support the team with wireframes and prototypes.",
    skills: ["Figma", "Wireframing", "UI Design"],
    openings: 2,
    status: "Filled",
  },

  // Everest Systems: ALL FILLED
  {
    company: everest._id,
    title: "QA Engineer",
    category: "QA",
    type: "Part-time",
    mode: "Hybrid",
    salary: "Negotiable",
    description: "Write test cases and run manual and automated tests.",
    skills: ["Testing", "Selenium", "Jira", "SQL"],
    openings: 2,
    status: "Filled",
  },
  {
    company: everest._id,
    title: "DevOps Engineer",
    category: "DevOps",
    type: "Full-time",
    mode: "On-site",
    salary: "Rs. 80,000 - 100,000",
    description: "Manage CI/CD and cloud servers.",
    skills: ["Docker", "AWS", "Linux", "CI/CD"],
    openings: 1,
    status: "Filled",
  },
]);

console.log("Seeded companies and jobs");
process.exit(0);
