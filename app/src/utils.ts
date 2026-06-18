import {
  BarChart2,
  Briefcase,
  Compass,
  FileEdit,
  FileText,
  MessageSquare,
  ScanText,
} from "lucide-react";
import type { Analysis, InterviewData, ResumeData } from "./types";
import jsPDF from "jspdf";

export const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    badge: null,
    desc: "Try before you commit",
    features: [
      "3 AI requests total",
      "ATS score report",
      "Basic job matches",
      "1 resume template",
      "Community support",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro Monthly",
    price: "₹299",
    period: "/ month",
    badge: "Most Flexible",
    desc: "Full access, cancel anytime",
    features: [
      "Unlimited resume analyses",
      "Full ATS + strength/weakness report",
      "Unlimited job matching",
      "All resume templates + PDF export",
      "Unlimited interview prep",
      "Priority AI processing",
      "Email support",
    ],
    cta: "Get Pro Monthly",
    highlight: false,
  },
  {
    name: "Pro 6-Month",
    price: "₹1,499",
    period: "/ 6 months",
    badge: "Best Value",
    desc: "Save 17% vs monthly",
    features: [
      "Everything in Pro Monthly",
      "Early access to new features",
      "Resume review by AI weekly",
      "LinkedIn profile tips",
      "Dedicated support",
    ],
    cta: "Get Best Value",
    highlight: true,
  },
];

export const Features = [
  {
    icon: ScanText,
    color: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/20",
    title: "AI Resume Analyser",
    desc: "Upload your resume and get an instant ATS compatibility score. Our AI pinpoints strengths, weaknesses, missing keywords, and formatting issues so you can fix them before recruiters even see it.",
    bullets: [
      "ATS score out of 100",
      "Strengths & weaknesses breakdown",
      "Keyword gap analysis",
      "Section-by-section feedback",
    ],
  },
  {
    icon: Briefcase,
    color: "from-emerald-500 to-teal-400",
    glow: "shadow-emerald-500/20",
    title: "Smart Job Matcher",
    desc: "After analysing your resume, CareerAI matches you with roles that actually fit your skills and experience — no more applying blindly and wondering why you hear nothing back.",
    bullets: [
      "Personalised job recommendations",
      "Match % per role",
      "Skill gap for each job",
      "One-click apply guidance",
    ],
  },
  {
    icon: FileEdit,
    color: "from-pink-500 to-rose-400",
    glow: "shadow-pink-500/20",
    title: "AI Resume Creator",
    desc: "Answer a few questions about your experience and goals. Our AI crafts a recruiter-ready, ATS-optimised resume tailored to the roles you're targeting.",
    bullets: [
      "Auto-generated content",
      "Industry-specific templates",
      "ATS-friendly formatting",
      "Export as PDF instantly",
    ],
  },
  {
    icon: MessageSquare,
    color: "from-amber-500 to-orange-400",
    glow: "shadow-amber-500/20",
    title: "Interview Preparation",
    desc: "Get personalised interview questions based on your skills or resume. Practice with AI feedback, sharpen your answers, and walk into every interview with confidence.",
    bullets: [
      "Resume-based question sets",
      "Skill-specific practice",
      "AI answer feedback",
      "Behavioural & technical rounds",
    ],
  },
];

export const features = [
  { icon: FileText, label: "Resume Builder" },
  { icon: BarChart2, label: "Resume Analyser" },
  { icon: Compass, label: "Career Guide" },
  { icon: MessageSquare, label: "Interview Prep" },
];

export function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export const matchColor = (s: number) =>
  s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";
export const matchBg = (s: number) =>
  s >= 80
    ? "bg-emerald-500/10 border-emerald-500/25"
    : s >= 60
    ? "bg-amber-500/10 border-amber-500/25"
    : "bg-red-500/10 border-red-500/25";

/* ── Download as PDF using jsPDF ── */
export async function downloadInterview(data: InterviewData) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const ml = 15,
    tw = 180;
  let y = 20;

  const checkPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(18).setFont("helvetica", "bold").setTextColor(99, 102, 241);
  doc.text("Interview Questions", ml, y);
  y += 7;
  doc
    .setFontSize(10)
    .setFont("helvetica", "normal")
    .setTextColor(100, 100, 100);
  doc.text(
    `Role: ${data.role}  ·  Round: ${
      data.round === "hr" ? "HR Round" : "Technical Round"
    }`,
    ml,
    y
  );
  y += 10;

  data.questions.forEach((q, i) => {
    checkPage();
    doc.setFontSize(9).setFont("helvetica", "bold").setTextColor(99, 102, 241);
    doc.text(`Q${i + 1}  [${q.category}]`, ml, y);
    y += 5;

    doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(26, 26, 26);
    const qLines = doc.splitTextToSize(q.question, tw);
    doc.text(qLines, ml, y);
    y += qLines.length * 5 + 2;

    doc
      .setFontSize(8.5)
      .setFont("helvetica", "italic")
      .setTextColor(120, 120, 120);
    const hLines = doc.splitTextToSize(`Hint: ${q.hint}`, tw);
    doc.text(hLines, ml, y);
    y += hLines.length * 4.5 + 2;

    doc
      .setDrawColor(229, 231, 235)
      .setLineWidth(0.3)
      .line(ml, y, ml + tw, y);
    y += 6;
  });

  doc.save(`${data.role.replace(/\s+/g, "_")}_${data.round}_interview.pdf`);
}

export function generateResumePDF(r: ResumeData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210,
    ml = 15,
    mr = 15,
    tw = W - ml - mr;
  let y = 18;

  const heading = (text: string) => {
    doc.setFontSize(7).setFont("helvetica", "bold").setTextColor(99, 102, 241);
    doc.text(text.toUpperCase(), ml, y);
    doc
      .setDrawColor(229, 231, 235)
      .setLineWidth(0.3)
      .line(ml, y + 1, ml + tw, y + 1);
    y += 6;
  };
  const addText = (
    text: string,
    size: number,
    style: "normal" | "bold",
    color: [number, number, number],
    indent = 0,
    maxWidth?: number
  ) => {
    doc
      .setFontSize(size)
      .setFont("helvetica", style)
      .setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth ?? tw - indent);
    doc.text(lines, ml + indent, y);
    y += lines.length * (size * 0.45) + 1;
  };
  const gap = (n = 3) => {
    y += n;
  };
  const checkPage = (needed = 12) => {
    if (y + needed > 280) {
      doc.addPage();
      y = 15;
    }
  };

  // ── Header ──
  doc.setFontSize(20).setFont("helvetica", "bold").setTextColor(26, 26, 26);
  doc.text(r.name, ml, y);
  y += 7;
  const contacts = [r.email, r.phone, r.location, r.linkedin]
    .filter(Boolean)
    .join("  •  ");
  doc.setFontSize(8).setFont("helvetica", "normal").setTextColor(100, 100, 100);
  doc.text(contacts, ml, y);
  y += 8;

  // ── Summary ──
  if (r.summary) {
    heading("Summary");
    addText(r.summary, 9, "normal", [55, 65, 81], 0, tw);
    gap();
  }

  // ── Experience ──
  if (r.experience?.length) {
    heading("Experience");
    r.experience.forEach((e) => {
      checkPage(14);
      doc.setFontSize(10).setFont("helvetica", "bold").setTextColor(26, 26, 26);
      doc.text(
        `${e.title}  ·  ${e.company}${e.location ? `, ${e.location}` : ""}`,
        ml,
        y
      );
      doc
        .setFontSize(8)
        .setFont("helvetica", "normal")
        .setTextColor(130, 130, 130);
      const dateText = `${e.startDate} – ${e.endDate}`;
      doc.text(dateText, W - mr - doc.getTextWidth(dateText), y);
      y += 5;
      e.bullets.filter(Boolean).forEach((b) => {
        checkPage(6);
        addText(`• ${b}`, 8.5, "normal", [55, 65, 81], 3, tw - 3);
      });
      gap(2);
    });
  }

  // ── Education ──
  if (r.education?.length) {
    heading("Education");
    r.education.forEach((e) => {
      checkPage(10);
      doc.setFontSize(10).setFont("helvetica", "bold").setTextColor(26, 26, 26);
      doc.text(
        `${e.degree}  ·  ${e.school}${e.location ? `, ${e.location}` : ""}`,
        ml,
        y
      );
      const yr = `${e.year}${e.gpa ? `  ·  GPA ${e.gpa}` : ""}`;
      doc
        .setFontSize(8)
        .setFont("helvetica", "normal")
        .setTextColor(130, 130, 130);
      doc.text(yr, W - mr - doc.getTextWidth(yr), y);
      y += 6;
    });
    gap();
  }

  // ── Skills ──
  if (r.skills?.technical?.length || r.skills?.soft?.length) {
    heading("Skills");
    if (r.skills.technical?.length) {
      doc.setFontSize(9).setFont("helvetica", "bold").setTextColor(55, 65, 81);
      doc.text("Technical: ", ml, y);
      const lw = doc.getTextWidth("Technical: ");
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(r.skills.technical.join(", "), tw - lw);
      doc.text(lines, ml + lw, y);
      y += lines.length * 4 + 2;
    }
    if (r.skills.soft?.length) {
      doc.setFontSize(9).setFont("helvetica", "bold").setTextColor(55, 65, 81);
      doc.text("Soft: ", ml, y);
      const lw = doc.getTextWidth("Soft: ");
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(r.skills.soft.join(", "), tw - lw);
      doc.text(lines, ml + lw, y);
      y += lines.length * 4 + 2;
    }
    gap();
  }

  // ── Projects ──
  if (r.projects?.length) {
    heading("Projects");
    r.projects.forEach((p) => {
      checkPage(12);
      doc.setFontSize(10).setFont("helvetica", "bold").setTextColor(26, 26, 26);
      doc.text(p.name, ml, y);
      if (p.link) {
        doc
          .setFontSize(8)
          .setFont("helvetica", "normal")
          .setTextColor(99, 102, 241);
        doc.text(`  ${p.link}`, ml + doc.getTextWidth(p.name), y);
      }
      y += 5;
      addText(p.description, 8.5, "normal", [55, 65, 81], 0, tw);
      gap(2);
    });
  }

  // ── Certifications ──
  if (r.certifications?.length) {
    heading("Certifications");
    addText(r.certifications.join("  •  "), 9, "normal", [55, 65, 81], 0, tw);
  }

  doc.save(`${r.name.replace(/\s+/g, "_")}_Resume.pdf`);
}

export const scoreColor = (s: number) =>
  s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";
export const scoreBar = (s: number) =>
  s >= 80
    ? "from-emerald-500 to-teal-400"
    : s >= 60
    ? "from-amber-500 to-orange-400"
    : "from-red-500 to-rose-400";
export const prioBg = {
  high: "bg-red-500/10 border-red-500/20",
  medium: "bg-amber-500/10 border-amber-500/20",
  low: "bg-emerald-500/10 border-emerald-500/20",
};
export const prioColor = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-emerald-400",
};
export const prioEmoji = { high: "🔴", medium: "🟡", low: "🟢" };

export function downloadReport(result: Analysis) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Resume Analysis Report</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',sans-serif;background:#f8fafc;color:#1e293b;padding:40px}
  .header{background:linear-gradient(135deg,#6366f1,#34d399);border-radius:16px;padding:32px;color:white;margin-bottom:24px;display:flex;align-items:center;gap:24px}
  .circle{width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
  .circle-num{font-size:32px;font-weight:900}
  .circle-lbl{font-size:11px;opacity:.7;text-transform:uppercase;letter-spacing:1px}
  .title{font-size:20px;font-weight:800;margin-bottom:8px}
  .summary{font-size:14px;opacity:.9;line-height:1.6}
  .card{background:white;border-radius:12px;padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  .label{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin-bottom:16px;font-weight:600}
  .bar-row{margin-bottom:14px}
  .bar-hd{display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px}
  .bar-track{height:6px;background:#e2e8f0;border-radius:99px;overflow:hidden}
  .bar-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#6366f1,#34d399)}
  .bar-fb{font-size:12px;color:#64748b;margin-top:4px}
  .strength{display:flex;gap:8px;font-size:13px;color:#334155;margin-bottom:8px}
  .sug{border-radius:10px;padding:14px;margin-bottom:10px;border:1px solid}
  .sug.high{background:#fff5f5;border-color:#fecaca}
  .sug.medium{background:#fffbeb;border-color:#fde68a}
  .sug.low{background:#f0fdf4;border-color:#bbf7d0}
  .sug-hd{display:flex;justify-content:space-between;margin-bottom:6px}
  .sug-cat{font-weight:600;font-size:13px}
  .sug-prio{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
  .sug-issue{font-size:12px;color:#64748b;margin-bottom:6px}
  .sug-rec{font-size:12px;color:#334155}
  .footer{text-align:center;font-size:11px;color:#94a3b8;margin-top:24px}
</style></head><body>

<div class="header">
  <div class="circle">
    <span class="circle-num">${result.atsScore}</span>
    <span class="circle-lbl">ATS</span>
  </div>
  <div>
    <div class="title">Resume Analysis Report</div>
    <div class="summary">${result.summary}</div>
  </div>
</div>

<div class="card">
  <div class="label">Score Breakdown</div>
  ${Object.entries(result.scoreBreakdown)
    .map(
      ([key, val]) => `
    <div class="bar-row">
      <div class="bar-hd"><span style="text-transform:capitalize">${key}</span><strong>${val.score}/100</strong></div>
      <div class="bar-track"><div class="bar-fill" style="width:${val.score}%"></div></div>
      <div class="bar-fb">${val.feedback}</div>
    </div>`
    )
    .join("")}
</div>

<div class="card">
  <div class="label">Strengths</div>
  ${result.strengths
    .map((s) => `<div class="strength"><span>✓</span>${s}</div>`)
    .join("")}
</div>

<div class="card">
  <div class="label">Suggestions</div>
  ${result.suggestions
    .map(
      (s) => `
    <div class="sug ${s.priority}">
      <div class="sug-hd">
        <span class="sug-cat">${s.category}</span>
        <span class="sug-prio">${prioEmoji[s.priority]} ${s.priority}</span>
      </div>
      <div class="sug-issue">${s.issue}</div>
      <div class="sug-rec">→ ${s.recommendation}</div>
    </div>`
    )
    .join("")}
</div>

<div class="footer">Generated by CareerAI · ${new Date().toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  )}</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume-analysis.html";
  a.click();
  URL.revokeObjectURL(url);
}
