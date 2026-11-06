import { useRef, useState } from "react";
import type { Education, Experience, Project, ResumeData } from "../types";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Loader2,
  Plus,
  Trash,
  Upload,
} from "lucide-react";
import { generateResumePDF, toBase64 } from "../utils";
import axios from "axios";
import { server } from "../main";

const blankExp = (): Experience => ({
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  bullets: [""],
});
const blankEdu = (): Education => ({
  degree: "",
  school: "",
  location: "",
  year: "",
  gpa: "",
});

const blankProj = (): Project => ({ name: "", description: "", link: "" });

const Field = ({ label, value, onChange, placeholder, textarea }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-white/30 uppercase tracking-widest">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="input-field resize-node"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field resize-node"
      />
    )}
  </div>
);

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/2 transition-colors"
      >
        <span className="text-sm font-semibold text-white/80">{title}</span>
        {open ? (
          <ChevronUp size={16} className="text-white/30" />
        ) : (
          <ChevronDown size={16} className="text-white/30" />
        )}
      </button>
      {open && <div className="px-6 pb-6 flex flex-col gap-4">{children}</div>}
    </div>
  );
}

const BuildResumePage = () => {
  const [mode, setMode] = useState<"manual" | "improve">("manual");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [basics, setBasics] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  });

  const [summary, setSummary] = useState("");
  const [experience, setExp] = useState<Experience[]>([blankExp()]);
  const [education, setEdu] = useState<Education[]>([blankEdu()]);
  const [techSkills, setTech] = useState("");
  const [softSkills, setSoft] = useState("");
  const [projects, setProjects] = useState<Project[]>([blankProj()]);
  const [certs, setCerts] = useState("");

  function updateExp(i: number, key: keyof Experience, val: any) {
    setExp((p) => p.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)));
  }

  function updateButtet(ei: number, bi: number, val: string) {
    setExp((p) =>
      p.map((e, i) =>
        i === ei
          ? { ...e, bullets: e.bullets.map((b, j) => (j === bi ? val : b)) }
          : e
      )
    );
  }

  function handleFileChange(f: File) {
    if (f.type !== "application/pdf")
      return setError("Please upload a pdf file.");
    if (f.size > 5 * 1024 * 1024)
      return setError("File size should be less than 5MB.");

    setError("");
    setFile(f);
  }

  async function handleSubmit() {
    setError("");
    setResult(null);
    if (mode === "improve" && !file) {
      return setError("Please upload your resume pdf.");
    }

    if (mode === "manual" && !basics.name.trim()) {
      return setError("Please Enter your name");
    }
    setLoading(true);
    try {
      let payload: any = { mode };
      if (mode === "manual") {
        payload.formData = {
          ...basics,
          summary,
          experience,
          education,
          skills: {
            technical: techSkills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            soft: softSkills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          },
          projects,
          certifications: certs
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
      } else {
        payload.pdfBase64 = await toBase64(file!);
      }

      const { data } = await axios.post(
        `${server}/api/ai/resume-build`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResult(data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to build resume");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-page min-h-screen pt-20 px-4 md:px-8 pb-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="glass-card p-1.5 flex gap-1.5">
          {(["manual", "improve"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setResult(null);
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                mode === m ? "btn-primary" : "text-white/40 hover:text-white/70"
              }`}
            >
              {m === "manual"
                ? "Build from Scratch"
                : "Improve Existing Resume"}
            </button>
          ))}
        </div>

        {mode === "manual" && (
          <>
            <Section title="Personal Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  value={basics.name}
                  onChange={(v: string) =>
                    setBasics((p) => ({ ...p, name: v }))
                  }
                  placeholder="John Doe"
                />
                <Field
                  label="Email"
                  value={basics.email}
                  onChange={(v: string) =>
                    setBasics((p) => ({ ...p, email: v }))
                  }
                  placeholder="John@Doe.com"
                />
                <Field
                  label="Phone"
                  value={basics.phone}
                  onChange={(v: string) =>
                    setBasics((p) => ({ ...p, phone: v }))
                  }
                  placeholder="+91 1234567890"
                />
                <Field
                  label="Location"
                  value={basics.location}
                  onChange={(v: string) =>
                    setBasics((p) => ({ ...p, location: v }))
                  }
                  placeholder="Ranchi, 812345"
                />
                <Field
                  label="Linkedin Url"
                  value={basics.linkedin}
                  onChange={(v: string) =>
                    setBasics((p) => ({ ...p, linkedin: v }))
                  }
                  placeholder="linkedin.com/in/msd"
                />
                <Field
                  label="Professinal Summary (AI will enhance it)"
                  value={summary}
                  onChange={setSummary}
                  placeholder="Brief summary of your experience and goals..."
                  textarea
                />
              </div>
            </Section>

            <Section title="Work Experience">
              {experience.map((exp, ei) => (
                <div
                  key={ei}
                  className="flex flex-col gap-3 p-4 bg-white/3 rounded-xl border border-white/6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/30 uppercase tracking-widest">
                      Position {ei + 1}
                    </span>
                    {experience.length > 1 && (
                      <button
                        onClick={() =>
                          setExp((p) => p.filter((_, i) => i !== ei))
                        }
                        className="text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field
                      label="Job Title"
                      value={exp.title}
                      onChange={(v: string) => updateExp(ei, "title", v)}
                      placeholder="Software Engineer"
                    />
                    <Field
                      label="Company"
                      value={exp.company}
                      onChange={(v: string) => updateExp(ei, "company", v)}
                      placeholder="Google"
                    />
                    <Field
                      label="Location"
                      value={exp.location}
                      onChange={(v: string) => updateExp(ei, "location", v)}
                      placeholder="Ranchi, jharkhand"
                    />
                    <Field
                      label="Start Date"
                      value={exp.startDate}
                      onChange={(v: string) => updateExp(ei, "startDate", v)}
                      placeholder="April 2026"
                    />
                    <Field
                      label="End Date"
                      value={exp.endDate}
                      onChange={(v: string) => updateExp(ei, "endDate", v)}
                      placeholder="April 2026"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/30 uppercase tracking-widest">
                      Key Achivements / Responsiblities
                    </label>
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2">
                        <input
                          value={b}
                          onChange={(e) => updateButtet(ei, bi, e.target.value)}
                          placeholder={`Bullet ${
                            bi + 1
                          } - start with an action verb`}
                          className="input-field flex-1"
                        />
                        {exp.bullets.length > 1 && (
                          <button
                            onClick={() =>
                              updateExp(
                                ei,
                                "bullets",
                                exp.bullets.filter((_, j) => j !== bi)
                              )
                            }
                            className="text-red-400/50 hover:text-red-400 transition-colors"
                          >
                            <Trash size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        updateExp(ei, "bullets", [...exp.bullets, ""])
                      }
                      className="feature-pill self-start gap-1.5 cursor-pointer hover:border-white/15 transition-colors"
                    >
                      <Plus size={10} /> Add Bullet
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setExp((p) => [...p, blankExp()])}
                className="feature-pill self-start gap-1.5 cursor-pointer hover:border-white/15 transition-colors"
              >
                <Plus size={10} /> Add Experience
              </button>
            </Section>

            <Section title="Education">
              {education.map((edu, ei) => (
                <div
                  key={ei}
                  className="flex flex-col gap-3 p-4 bg-white/3 rounded-xl border border-white/6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/30 uppercase tracking-widest">
                      Education {ei + 1}
                    </span>
                    {education.length > 1 && (
                      <button
                        onClick={() =>
                          setEdu((p) => p.filter((_, i) => i !== ei))
                        }
                        className="text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field
                      label="Degree"
                      value={edu.degree}
                      onChange={(v: string) =>
                        setEdu((p) =>
                          p.map((e, i) => (i === ei ? { ...e, degree: v } : e))
                        )
                      }
                      placeholder="B.Tech CS"
                    />
                    <Field
                      label="School"
                      value={edu.school}
                      onChange={(v: string) =>
                        setEdu((p) =>
                          p.map((e, i) => (i === ei ? { ...e, school: v } : e))
                        )
                      }
                      placeholder="IIT Bombay"
                    />
                    <Field
                      label="Location"
                      value={edu.location}
                      onChange={(v: string) =>
                        setEdu((p) =>
                          p.map((e, i) =>
                            i === ei ? { ...e, location: v } : e
                          )
                        )
                      }
                      placeholder="Mumbai, India"
                    />
                    <Field
                      label="Year"
                      value={edu.year}
                      onChange={(v: string) =>
                        setEdu((p) =>
                          p.map((e, i) => (i === ei ? { ...e, year: v } : e))
                        )
                      }
                      placeholder="2026"
                    />

                    <Field
                      label="GPA (optional)"
                      value={edu.gpa}
                      onChange={(v: string) =>
                        setEdu((p) =>
                          p.map((e, i) => (i === ei ? { ...e, gpa: v } : e))
                        )
                      }
                      placeholder="8.5/10"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => setEdu((p) => [...p, blankEdu()])}
                className="feature-pill self-start gap-1.5 cursor-pointer hover:border-white/15 transition-colors"
              >
                <Plus size={10} /> Add Education
              </button>
            </Section>

            <Section title="skills">
              <Field
                label="Technical Skills (camma separated)"
                value={techSkills}
                onChange={setTech}
                placeholder="React, Node.js ...."
              />
              <Field
                label="Soft Skills (camma separated)"
                value={softSkills}
                onChange={setSoft}
                placeholder="Leadership, problem solving ...."
              />
            </Section>

            <Section title="Projects (Optional)">
              {projects.map((proj, pi) => (
                <div
                  key={pi}
                  className="flex flex-col gap-3 p-4 bg-white/3 rounded-xl border border-white/6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/30 uppercase tracking-widest">
                      Project {pi + 1}
                    </span>
                    {projects.length > 1 && (
                      <button
                        onClick={() =>
                          setProjects((p) => p.filter((_, i) => i !== pi))
                        }
                        className="text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field
                      label="Project Name"
                      value={proj.name}
                      onChange={(v: string) =>
                        setProjects((p) =>
                          p.map((e, i) => (i === pi ? { ...e, name: v } : e))
                        )
                      }
                      placeholder="Ai saas app"
                    />
                    <Field
                      label="Description"
                      value={proj.description}
                      onChange={(v: string) =>
                        setProjects((p) =>
                          p.map((e, i) =>
                            i === pi ? { ...e, description: v } : e
                          )
                        )
                      }
                      placeholder="Built with react and node.js..."
                      textarea
                    />
                    <Field
                      label="Link (optional)"
                      value={proj.link}
                      onChange={(v: string) =>
                        setProjects((p) =>
                          p.map((e, i) => (i === pi ? { ...e, link: v } : e))
                        )
                      }
                      placeholder="github.com/pkc/project"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => setProjects((p) => [...p, blankProj()])}
                className="feature-pill self-start gap-1.5 cursor-pointer hover:border-white/15 transition-colors"
              >
                <Plus size={10} /> Add Project
              </button>
            </Section>

            <Section title="Certifications (Optional)">
              <Field label="Certifications (comma seperated)" value={certs} onChange={setCerts} placeholder="AWS Developer, Google Analytics...."/>
            </Section>
          </>
        )}

        {mode === "improve" && (
          <>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFileChange(f);
              }}
              onClick={() => fileRef.current?.click()}
              className="glass-card border-dashed border-white/15 flex flex-col items-center justify-center gap-3 py-10 cursor-pointer hover:border-indigo-500/40 hover:bg-white/2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border-dashed border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                {file ? (
                  <FileText size={22} className="text-emerald-400" />
                ) : (
                  <Upload size={32} className="text-indigo-400" />
                )}
              </div>
              <div className="text-center">
                <p className="font-semibold text-white/80">
                  {file ? file.name : "Drop your resume here"}
                </p>
                <p className="text-white/35 text-sm mt-0.5">
                  or click to browse • PDF only • max 5MB
                </p>
              </div>
              <input
                type="file"
                ref={fileRef}
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileChange(f);
                  e.target.value = "";
                }}
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-red-400 text-sm flex items-center gap-1.5">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {!loading && (
          <button
            onClick={handleSubmit}
            className="btn-primary py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FileText size={16} />{" "}
            {mode === "manual" ? "Build my Resume" : "Improve My Resume"}
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={36} className="text-indigo-400 animate-spin" />
            <p className="text-white/40 text-sm">
              Building your ATS optimized resume...
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-4">
            <div className="glass-card p-8 flex flex-col gap-5 font-mono text-sm">
              <div className="border-b border-white/8 pb-5">
                <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-white/40 text-xs">
                  {[
                    result.email,
                    result.phone,
                    result.location,
                    result.linkedin,
                  ]
                    .filter(Boolean)
                    .map((v, i) => (
                      <span key={i}>{v}</span>
                    ))}
                </div>
              </div>
              {result.summary && (
                <div>
                  <p className="text-xs text-white/30 uppercase\ tracking-widest mb-2">
                    Summary
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              )}
              {result.experience?.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 uppercase\ tracking-widest mb-3">
                    Experience
                  </p>
                  {result.experience.map((e, i) => (
                    <div className="mb-4" key={i}>
                      <div className="flex justify-between flex-wrap gap-1">
                        <span className="font-semibold text-white/80">
                          {e.title} • {e.company}
                        </span>
                        <span className="text-white/35 text-xs">
                          {e.startDate} • {e.endDate}
                        </span>
                      </div>
                      <ul className="mt-1.5 flex flex-col gap-1 pl-3">
                        {e.bullets.filter(Boolean).map((b, j) => (
                          <li
                            key={j}
                            className="text-white/50 text-xs before:content-[-] before:mr-2"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {result.education?.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                    Education
                  </p>
                  {result.education.map((e, i) => (
                    <div
                      key={i}
                      className="flex justify-between flex-wrap gap-1 mb-2"
                    >
                      <span className=" text-white/70 font-medium">
                        {e.degree} • {e.school}
                      </span>
                      <span className="text-white/35 text-xs">
                        {e.year} {e.gpa ? ` • GPA ${e.gpa}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {(result.skills?.technical?.length > 0 ||
                result.skills?.soft?.length > 0) && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                    Skills
                  </p>
                  {result.skills.technical?.length > 0 && (
                    <p className="text-white/55 text-xs mb-1">
                      <span className="text-white/40 font-semibold">
                        Technical:{" "}
                      </span>
                      {result.skills.technical.join(", ")}
                    </p>
                  )}
                  {result.skills.soft?.length > 0 && (
                    <p className="text-white/55 text-xs mb-1">
                      <span className="text-white/40 font-semibold">
                        Soft:{" "}
                      </span>
                      {result.skills.soft.join(", ")}
                    </p>
                  )}
                </div>
              )}

              {result.projects?.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                    Projects
                  </p>
                  {result.projects.map((p, i) => (
                    <div key={i} className="mb-3">
                      <p className="text-white/70 font-semibold">
                        {p.name}
                        {p.link ? (
                          <span className="text-indigo-400 ml-2 text-xs font-normal">
                            {p.link}
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                      <p className="text-white/45 text-xs mt-1">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {result.certifications?.length > 0 && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                    Certifications
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.certifications.map((c, i) => (
                      <span key={i} className="feature-pill">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => generateResumePDF(result)}
              className="btn-primary py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildResumePage;