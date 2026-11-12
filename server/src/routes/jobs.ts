import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  getJobs,
  getCompanies,
  getCompany,
  getSavedJobs,
  toggleSaveJob,
  getSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/jobs.js";

const router = express.Router();

router.get("/", isAuth, getJobs);
router.get("/companies", isAuth, getCompanies);
router.get("/companies/:id", isAuth, getCompany);
router.get("/saved", isAuth, getSavedJobs);
router.get("/appointments", isAuth, getMyAppointments);
router.delete("/appointments/:id", isAuth, cancelAppointment);
router.get("/:id/slots", isAuth, getSlots);
router.post("/:id/book", isAuth, bookAppointment);
router.post("/:id/save", isAuth, toggleSaveJob);

export default router;