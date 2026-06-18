import express from "express";
import { analyseResume, jobMatcher } from "../controllers/ai.js";
import { isAuth } from "../middlewares/isAuth.js";

const router =express.Router();

router.post("/analyse", isAuth, analyseResume);
router.post("/job-matcher", isAuth, jobMatcher);

export default router;