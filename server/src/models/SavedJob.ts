import mongoose, { Schema } from "mongoose";

const savedJobSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  },
  { timestamps: true }
);

// one user can save a job only once
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model("SavedJob", savedJobSchema);