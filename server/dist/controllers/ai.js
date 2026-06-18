import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import User from "../models/User.js";
import TryCatch from "../middlewares/trycatch.js";
import { JobMatcherPrompt, ResumeAnalyserPrompt } from "../config/prompt.js";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });
export const analyseResume = TryCatch(async (req, res) => {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
        return res.status(400).json({
            message: "PDF data is required",
        });
    }
    const user = await User.findById(req.user?._id);
    if (!user || !user.canMakeRequest()) {
        return res.status(403).json({
            message: "Upgrade Your plan to continue",
        });
    }
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: ResumeAnalyserPrompt },
                    {
                        inlineData: {
                            mimeType: "application/pdf",
                            data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
                        },
                    },
                ],
            },
        ],
    });
    const rawText = response.text?.replace(/```json|```/g, "").trim();
    if (!rawText) {
        return res.status(500).json({
            message: "Ai returned empty response",
        });
    }
    let jsonResponse;
    try {
        jsonResponse = JSON.parse(rawText);
    }
    catch (error) {
        return res.status(500).json({
            message: "Ai returned invailed Json",
            rawResponse: response.text,
        });
    }
    if (!user.hasProAccess()) {
        user.freeRequestsUsed += 1;
        await user.save();
    }
    res.json(jsonResponse);
});
export const jobMatcher = TryCatch(async (req, res) => {
    const { mode, skills, experience, pdfBase64 } = req.body;
    if (!mode)
        return res.status(400).json({ message: "Mode is required" });
    if (mode === "manual" && (!skills?.length || !experience?.trim()))
        return res.status(400).json({
            message: "Skills and experience are required",
        });
    if (mode === "resume" && !pdfBase64)
        return res.status(400).json({
            message: "PDF is required",
        });
    const user = await User.findById(req.user?._id);
    if (!user || !user.canMakeRequest()) {
        return res.status(403).json({
            message: "Upgrade Your plan to continue",
        });
    }
    const parts = [{ text: JobMatcherPrompt(mode, skills, experience) }];
    if (mode === "resume") {
        parts.push({
            inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
            },
        });
    }
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts }],
    });
    const rawText = response.text?.replace(/```json|```/g, "").trim();
    if (!rawText) {
        return res.status(500).json({
            message: "Ai returned empty response",
        });
    }
    let jsonResponse;
    try {
        jsonResponse = JSON.parse(rawText);
    }
    catch (error) {
        return res.status(500).json({
            message: "Ai returned invailed Json",
            rawResponse: response.text,
        });
    }
    if (!user.hasProAccess()) {
        user.freeRequestsUsed += 1;
        await user.save();
    }
    res.json(jsonResponse);
});
