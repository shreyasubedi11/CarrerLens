import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  subscription: Date | null;
  freeRequestsUsed: number;
  bookedJobs: any[];

  hasProAccess(): boolean;
  canMakeRequest(): boolean;
}

const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },

    subscription: {
      type: Date,
      default: null,
    },

    freeRequestsUsed: { type: Number, default: 0 },

    bookedJobs: {
      type: [
        {
          appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
          job: { type: Schema.Types.ObjectId, ref: "Job" },
          jobTitle: String,
          company: String,
          date: String,
          slot: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

schema.methods.hasProAccess = function (): boolean {
  return !!this.subscription && new Date() < new Date(this.subscription);
};
schema.methods.canMakeRequest = function (): boolean {
  return this.hasProAccess() || this.freeRequestsUsed < 3;
};
const User = mongoose.model<IUser>("User", schema);

export default User;