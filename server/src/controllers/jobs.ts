import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import SavedJob from "../models/SavedJob.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

const SLOTS = ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// date must be tomorrow..14 days ahead, and not a Saturday
const isValidDate = (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T00:00:00Z`);
  if (isNaN(d.getTime())) return false;
  if (d.getUTCDay() === 6) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  return diff >= 1 && diff <= 14;
};

// GET /api/jobs?category=&status=&company=&search=&skills=react,node
export const getJobs = TryCatch(async (req: AuthenticatedRequest, res) => {
  const { category, status, company, search, skills } = req.query;

  const filter: any = {};
  if (category && category !== "All") filter.category = category;
  if (status && status !== "All") filter.status = status;
  if (company) filter.company = company;
  if (search) {
    const regex = new RegExp(escapeRegex(String(search)), "i");
    filter.$or = [{ title: regex }, { skills: regex }];
  }

  const jobs: any[] = await Job.find(filter)
    .populate("company", "name location website")
    .lean();

  const userSkills = String(skills || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const saved: any[] = await SavedJob.find({ user: req.user?._id }).lean();
  const bookings: any[] = await Appointment.find({
    user: req.user?._id,
  }).lean();
  const savedSet = new Set(saved.map((s) => String(s.job)));
  const bookingMap = new Map(bookings.map((b) => [String(b.job), b]));

  const result = jobs.map((job) => {
    const required = (job.skills || []).map((s: string) => s.toLowerCase());
    const matchedSkills = required.filter((s: string) =>
      userSkills.includes(s),
    );
    const match =
      userSkills.length && required.length
        ? Math.round((matchedSkills.length / required.length) * 100)
        : null;
    const booking = bookingMap.get(String(job._id));

    return {
      ...job,
      saved: savedSet.has(String(job._id)),
      booking: booking
        ? { _id: booking._id, date: booking.date, slot: booking.slot }
        : null,
      match,
      matchedSkills,
    };
  });

  // open first, then best match, then newest
  result.sort((a, b) => {
    if (a.status !== b.status) return a.status === "Open" ? -1 : 1;
    if ((b.match ?? -1) !== (a.match ?? -1))
      return (b.match ?? -1) - (a.match ?? -1);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json({ jobs: result });
});

// GET /api/jobs/companies
export const getCompanies = TryCatch(async (req: AuthenticatedRequest, res) => {
  const companies: any[] = await Company.find().lean();
  const jobs: any[] = await Job.find().lean();

  const result = companies.map((c) => {
    const mine = jobs.filter((j) => String(j.company) === String(c._id));
    const open = mine.filter((j) => j.status === "Open");
    return {
      ...c,
      openRoles: open.map((j) => ({
        _id: j._id,
        title: j.title,
        category: j.category,
      })),
      openVacancies: open.length,
      filledVacancies: mine.length - open.length,
      allFilled: mine.length > 0 && open.length === 0,
    };
  });

  // companies with open vacancies first
  result.sort((a, b) => Number(a.allFilled) - Number(b.allFilled));

  res.json({ companies: result });
});

// GET /api/jobs/companies/:id
export const getCompany = TryCatch(async (req: AuthenticatedRequest, res) => {
  const company = await Company.findById(req.params.id).lean();
  if (!company) return res.status(404).json({ message: "Company not found" });

  const jobs: any[] = await Job.find({ company: company._id }).lean();
  const bookings: any[] = await Appointment.find({
    user: req.user?._id,
  }).lean();
  const saved: any[] = await SavedJob.find({ user: req.user?._id }).lean();
  const bookingMap = new Map(bookings.map((b) => [String(b.job), b]));
  const savedSet = new Set(saved.map((s) => String(s.job)));

  const result = jobs
    .map((j) => {
      const booking = bookingMap.get(String(j._id));
      return {
        ...j,
        saved: savedSet.has(String(j._id)),
        booking: booking
          ? { _id: booking._id, date: booking.date, slot: booking.slot }
          : null,
      };
    })
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "Open" ? -1 : 1));

  res.json({ company, jobs: result });
});

// GET /api/jobs/saved
export const getSavedJobs = TryCatch(async (req: AuthenticatedRequest, res) => {
  const saved: any[] = await SavedJob.find({ user: req.user?._id })
    .populate({
      path: "job",
      populate: { path: "company", select: "name location website" },
    })
    .sort({ createdAt: -1 })
    .lean();

  const jobs = saved
    .filter((s) => s.job)
    .map((s) => ({ ...s.job, saved: true }));
  res.json({ jobs });
});

// POST /api/jobs/:id/save  (toggle)
export const toggleSaveJob = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await SavedJob.findOne({
      user: req.user?._id,
      job: jobId,
    });
    if (existing) {
      await SavedJob.deleteOne({ _id: existing._id });
      return res.json({ saved: false, message: "Removed from saved jobs" });
    }

    await SavedJob.create({ user: req.user?._id, job: jobId });
    res.json({ saved: true, message: "Job saved" });
  },
);

// GET /api/jobs/:id/slots?date=2026-11-12
export const getSlots = TryCatch(async (req: AuthenticatedRequest, res) => {
  const job: any = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (job.status === "Filled") {
    return res.status(400).json({ message: "This vacancy is already filled" });
  }

  const date = String(req.query.date || "");
  if (!isValidDate(date)) {
    return res
      .status(400)
      .json({ message: "Pick a date within the next 14 days (not Saturday)" });
  }

  const taken: any[] = await Appointment.find({
    company: job.company,
    date,
  }).lean();
  const takenSlots = new Set(taken.map((t) => t.slot));

  res.json({
    date,
    slots: SLOTS.map((slot) => ({ slot, available: !takenSlots.has(slot) })),
  });
});

// POST /api/jobs/:id/book   body: { date, slot }
export const bookAppointment = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const job: any = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status === "Filled") {
      return res
        .status(400)
        .json({ message: "This vacancy is already filled" });
    }

    const { date, slot } = req.body;
    if (!isValidDate(String(date || "")) || !SLOTS.includes(slot)) {
      return res.status(400).json({ message: "Invalid date or time slot" });
    }

    const already = await Appointment.findOne({
      user: req.user?._id,
      job: job._id,
    });
    if (already) {
      return res.status(400).json({ message: "You already booked this job" });
    }

    try {
      const appointment = await Appointment.create({
         user: req.user?._id,
        job: job._id,
        company: job.company,
        date,
        slot,
      });

      // also save a short summary of the booking on the user document
      const companyDoc: any = await Company.findById(job.company).lean();
      await User.findByIdAndUpdate(req.user?._id, {
        $push: {
          bookedJobs: {
            appointment: appointment._id,
            job: job._id,
            jobTitle: job.title,
            company: companyDoc?.name,
            date,
            slot,
          },
        },
      } as any);

      res.status(201).json({ message: "Appointment booked", appointment });
    } catch (error: any) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "That slot was just taken, pick another" });
      }
      throw error;
    }
  },
);

// GET /api/jobs/appointments
export const getMyAppointments = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const appointments: any[] = await Appointment.find({ user: req.user?._id })
      .populate("job", "title category")
      .populate("company", "name location")
      .sort({ date: 1 })
      .lean();

    res.json({ appointments });
  },
);

// DELETE /api/jobs/appointments/:id
export const cancelAppointment = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const deleted = await Appointment.findOneAndDelete({
      _id: req.params.id,
      user: req.user?._id,
    });
    if (!deleted)
      return res.status(404).json({ message: "Appointment not found" });

    // remove it from the user document too
    await User.findByIdAndUpdate(req.user?._id, {
      $pull: { bookedJobs: { appointment: deleted._id } },
    } as any);

    res.json({ message: "Appointment cancelled" });
  },
);
