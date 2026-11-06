import express from "express";
import { analyseResume, buildResume, generateInterview, jobMatcher } from "../controllers/ai.js";
import { isAuth } from "../middlewares/isAuth.js";

const router =express.Router();

router.post("/analyse", isAuth, analyseResume);
router.post("/job-matcher", isAuth, jobMatcher);
router.post("/interview", isAuth, generateInterview);
router.post("/resume-build", isAuth, buildResume);

export default router;