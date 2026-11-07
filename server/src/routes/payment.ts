import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { checkOut, paymentVerification } from "../controllers/payment.js";

const router = express.Router();

router.post("/checkout", isAuth, checkOut);
router.post("/verify", isAuth, paymentVerification);

export default router;
