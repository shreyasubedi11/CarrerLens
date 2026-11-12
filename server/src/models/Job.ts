import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "UI/UX",
        "QA",
        "Data/AI",
        "DevOps",
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    mode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
    },
    salary: { type: String, default: "Negotiable" },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    openings: { type: Number, default: 1 },
    status: { type: String, enum: ["Open", "Filled"], default: "Open" },
    deadline: { type: Date },
    applyLink: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
