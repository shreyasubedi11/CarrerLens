import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transaction_uuid: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    duration: { type: Number, required: true },
    status: { type: String, default: "PENDING" },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
