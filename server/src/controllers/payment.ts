import crypto from "crypto";
import axios from "axios";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";

// change prices to whatever you want (NPR)
const PLANS: Record<number, { amount: number; days: number }> = {
  1: { amount: 399, days: 30 },
  6: { amount: 1999, days: 180 },
};

const sign = (message: string) =>
  crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY as string)
    .update(message)
    .digest("base64");

export const checkOut = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user_id = req.user?._id;
  if (!user_id) return res.status(400).json({ message: "No User Id" });

  const user = await User.findById(user_id);
  const subTime = user?.subscription
    ? new Date(user.subscription).getTime()
    : 0;
  if (subTime > Date.now()) {
    return res.status(400).json({ message: "User already subscribed" });
  }

  const duration = Number(req.body.duration);
  const plan = PLANS[duration];
  if (!plan) return res.status(400).json({ message: "Invalid plan" });

  const transaction_uuid = crypto.randomUUID();
  const total_amount = String(plan.amount);
  const product_code = process.env.ESEWA_PRODUCT_CODE as string;

  await Payment.create({
    user: user_id,
    transaction_uuid,
    amount: plan.amount,
    duration,
  });

  // order matters: total_amount, transaction_uuid, product_code
  const signature = sign(
    `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`,
  );

  res.status(201).json({
    formUrl: process.env.ESEWA_FORM_URL,
    fields: {
      amount: total_amount,
      tax_amount: "0",
      total_amount,
      transaction_uuid,
      product_code,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      failure_url: `${process.env.CLIENT_URL}/`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
  });
});

export const paymentVerification = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const { data } = req.body;
    if (!data) return res.status(400).json({ message: "No payment data" });

    let decoded: any;
    try {
      decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
    } catch {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // 1. verify the signature eSewa sent back
    const message = String(decoded.signed_field_names)
      .split(",")
      .map((f: string) => `${f}=${decoded[f]}`)
      .join(",");

    if (sign(message) !== decoded.signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 2. find OUR record (never trust the amount from the browser)
    const payment: any = await Payment.findOne({
      transaction_uuid: decoded.transaction_uuid,
      user: req.user?._id,
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status === "COMPLETE") {
      const u = await User.findById(req.user?._id);
      return res.json({ message: "Already verified", updatedUser: u });
    }

    // 3. double-check with eSewa's status API
    const { data: statusRes } = await axios.get(
      process.env.ESEWA_STATUS_URL as string,
      {
        params: {
          product_code: process.env.ESEWA_PRODUCT_CODE,
          total_amount: payment.amount,
          transaction_uuid: payment.transaction_uuid,
        },
      },
    );

    if (statusRes.status !== "COMPLETE") {
      await Payment.updateOne(
        { transaction_uuid: decoded.transaction_uuid },
        { status: statusRes.status || "FAILED" },
      );
      return res.status(400).json({ message: "Payment Failed" });
    }

    // 4. activate subscription
    const plan = PLANS[payment.duration as number];
    if (!plan) return res.status(400).json({ message: "Invalid plan" });

    await Payment.updateOne(
      { transaction_uuid: decoded.transaction_uuid },
      { status: "COMPLETE" },
    );

    const expiryDate = new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000);

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { subscription: expiryDate },
      { new: true },
    );

    res.json({ message: "Subscription Purchased Successfully", updatedUser });
  },
);
