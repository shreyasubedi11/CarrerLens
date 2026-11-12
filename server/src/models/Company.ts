import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    website: { type: String, default: "" },
    description: { type: String, default: "" },
    size: { type: String, default: "11-50 employees" },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);