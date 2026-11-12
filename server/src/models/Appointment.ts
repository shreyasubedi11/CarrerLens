import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    date: { type: String, required: true }, // "2026-11-12"
    slot: { type: String, required: true }, // "10:00 AM"
  },
  { timestamps: true }
);

// a user books a job once
appointmentSchema.index({ user: 1, job: 1 }, { unique: true });
// a company's time slot can only be booked once
appointmentSchema.index({ company: 1, date: 1, slot: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);