import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarCheck,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { server } from "../main";

const CATEGORIES = ["All", "Frontend", "Backend", "Full Stack", "UI/UX", "QA", "Data/AI", "DevOps"];

type Tab = "companies" | "jobs" | "saved" | "appointments";

const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const pad = (n: number) => String(n).padStart(2, "0");
const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const getDateOptions = () => {
  const out: { value: string; label: string }[] = [];
  for (let i = 1; i <= 13; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() === 6) continue; // no Saturdays
    out.push({
      value: toDateStr(d),
      label: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }),
    });
  }
  return out;
};

const prettyDate = (s: string) =>
  new Date(`${s}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ---------- Job card ---------- */
export function JobCard({
  job,
  companyName,
  onSave,
  onBook,
}: {
  job: any;
  companyName?: string;
  onSave: (id: string) => void;
  onBook: (job: any, companyName: string) => void;
}) {
  const filled = job.status === "Filled";
  const name =
    companyName || (typeof job.company === "object" ? job.company?.name : "") || "";
  const location = typeof job.company === "object" ? job.company?.location : "";

  return (
    <div className={`glass-card p-5 flex flex-col gap-3 ${filled ? "opacity-70" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-white/90">{job.title}</p>
          <p className="text-sm text-white/45 flex items-center gap-1.5 flex-wrap mt-0.5">
            <Building2 size={13} /> {name}
            {location && (
              <>
                <span className="text-white/20">•</span>
                <MapPin size={13} /> {location}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {job.match !== null && job.match !== undefined && !filled && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              {job.match}% match
            </span>
          )}
          <span
            className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
              filled
                ? "bg-red-500/10 text-red-400 border-red-500/25"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
            }`}
          >
            {filled ? "Filled" : "Open"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-white/50">
        <span className="px-2 py-1 rounded-md bg-white/5">{job.category}</span>
        <span className="px-2 py-1 rounded-md bg-white/5">{job.type}</span>
        <span className="px-2 py-1 rounded-md bg-white/5">{job.mode}</span>
        <span className="px-2 py-1 rounded-md bg-white/5">{job.salary}</span>
        {!filled && (
          <span className="px-2 py-1 rounded-md bg-white/5">
            {job.openings} {job.openings === 1 ? "opening" : "openings"}
          </span>
        )}
      </div>

      <p className="text-sm text-white/45">{job.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {job.skills?.map((s: string) => {
          const matched = job.matchedSkills?.includes(s.toLowerCase());
          return (
            <span
              key={s}
              className={`text-[11px] px-2 py-0.5 rounded-full border ${
                matched
                  ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                  : "border-white/10 text-white/40"
              }`}
            >
              {s}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-1">
        {filled ? (
          <p className="flex-1 text-center text-xs text-red-400/80 py-2.5">
            This vacancy is filled
          </p>
        ) : job.booking ? (
          <p className="flex-1 text-center text-xs text-emerald-400 py-2.5 flex items-center justify-center gap-1.5">
            <CalendarCheck size={14} /> Booked: {prettyDate(job.booking.date)}, {job.booking.slot}
          </p>
        ) : (
          <button
            onClick={() => onBook(job, name)}
            className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold"
          >
            Book interview
          </button>
        )}
        <button
          onClick={() => onSave(job._id)}
          className="p-2.5 rounded-xl bg-white/6 hover:bg-white/10 border border-white/10 text-white/70"
          title={job.saved ? "Remove from saved" : "Save job"}
        >
          {job.saved ? <BookmarkCheck size={18} className="text-indigo-400" /> : <Bookmark size={18} />}
        </button>
      </div>
    </div>
  );
}

/* ---------- Booking modal ---------- */
export function BookingModal({
  job,
  companyName,
  onClose,
  onBooked,
}: {
  job: any;
  companyName: string;
  onClose: () => void;
  onBooked: () => void;
}) {
  const dates = getDateOptions();
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<{ slot: string; available: boolean }[]>([]);
  const [slot, setSlot] = useState("");
  const [busy, setBusy] = useState(false);

  const pickDate = async (value: string) => {
    setDate(value);
    setSlot("");
    setSlots([]);
    try {
      const { data } = await axios.get(`${server}/api/jobs/${job._id}/slots`, {
        ...auth(),
        params: { date: value },
      });
      setSlots(data.slots);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not load time slots");
    }
  };

  const confirm = async () => {
    try {
      setBusy(true);
      const { data } = await axios.post(
        `${server}/api/jobs/${job._id}/book`,
        { date, slot },
        auth()
      );
      toast.success(data.message);
      onBooked();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
      if (date) pickDate(date); // refresh slots
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-6 flex flex-col gap-4 bg-[#0d0d14]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">Book an interview</p>
            <p className="text-sm text-white/45">
              {job.title} at {companyName}
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Pick a date</p>
          <div className="flex flex-wrap gap-2">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => pickDate(d.value)}
                className={`text-xs px-3 py-2 rounded-lg border ${
                  date === d.value
                    ? "bg-indigo-500/20 border-indigo-500/50 text-white"
                    : "border-white/10 text-white/60 hover:bg-white/5"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {date && (
          <div>
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Pick a time</p>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => (
                <button
                  key={s.slot}
                  disabled={!s.available}
                  onClick={() => setSlot(s.slot)}
                  className={`text-sm py-2 rounded-lg border ${
                    !s.available
                      ? "border-white/5 text-white/20 line-through cursor-not-allowed"
                      : slot === s.slot
                      ? "bg-indigo-500/20 border-indigo-500/50 text-white"
                      : "border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {s.slot}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={confirm}
          disabled={!date || !slot || busy}
          className="btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-40"
        >
          {busy ? "Booking..." : "Confirm booking"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
const Jobs = () => {
  const [tab, setTab] = useState<Tab>("companies");
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [companies, setCompanies] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [saved, setSaved] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<{ job: any; companyName: string } | null>(null);

  // user's skills from resume analysis (we'll fill this from the analyser later)
  const mySkills = localStorage.getItem("userSkills") || "";

  const load = async () => {
    try {
      setLoading(true);
      if (companyId) {
        const { data } = await axios.get(`${server}/api/jobs/companies/${companyId}`, auth());
        setCompany(data.company);
        setCompanyJobs(data.jobs);
      } else if (tab === "companies") {
        const { data } = await axios.get(`${server}/api/jobs/companies`, auth());
        setCompanies(data.companies);
      } else if (tab === "jobs") {
        const { data } = await axios.get(`${server}/api/jobs`, {
          ...auth(),
          params: { category, status, search, skills: mySkills },
        });
        setJobs(data.jobs);
      } else if (tab === "saved") {
        const { data } = await axios.get(`${server}/api/jobs/saved`, auth());
        setSaved(data.jobs);
      } else {
        const { data } = await axios.get(`${server}/api/jobs/appointments`, auth());
        setAppointments(data.appointments);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [tab, companyId, category, status, search]);

  const toggleSave = async (id: string) => {
    try {
      const { data } = await axios.post(`${server}/api/jobs/${id}/save`, {}, auth());
      toast.success(data.message);
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const { data } = await axios.delete(`${server}/api/jobs/appointments/${id}`, auth());
      toast.success(data.message);
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const openBooking = (job: any, companyName: string) => setBooking({ job, companyName });

  const tabs: { key: Tab; label: string }[] = [
    { key: "companies", label: "Companies" },
    { key: "jobs", label: "All jobs" },
    { key: "saved", label: "Saved" },
    { key: "appointments", label: "My bookings" },
  ];

  return (
    <div className="bg-page min-h-screen pt-20 px-4 md:px-8 pb-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "'Syne', sans-serif" }}>
            Job <span className="text-gradient">portal</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Browse IT companies, see who is hiring, and book an interview slot.
          </p>
        </div>

        {/* tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setCompanyId(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                tab === t.key && !companyId
                  ? "bg-indigo-500/20 border-indigo-500/40 text-white"
                  : "border-white/10 text-white/50 hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-white/40 text-sm">Loading...</p>}

        {/* company detail */}
        {companyId && company && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setCompanyId(null)}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white w-fit"
            >
              <ArrowLeft size={14} /> Back to companies
            </button>
            <div className="glass-card p-6">
              <p className="text-xl font-bold">{company.name}</p>
              <p className="text-sm text-white/45 mt-1 flex items-center gap-1.5">
                <MapPin size={13} /> {company.location} • {company.size}
              </p>
              <p className="text-sm text-white/50 mt-3">{company.description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {companyJobs.map((j) => (
                <JobCard
                  key={j._id}
                  job={j}
                  companyName={company.name}
                  onSave={toggleSave}
                  onBook={openBooking}
                />
              ))}
            </div>
          </div>
        )}

        {/* companies */}
        {!companyId && tab === "companies" && (
          <div className="grid md:grid-cols-2 gap-4">
            {companies.map((c) => (
              <div key={c._id} className="glass-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white/90">{c.name}</p>
                    <p className="text-sm text-white/45 flex items-center gap-1.5 mt-0.5">
                      <MapPin size={13} /> {c.location} • {c.size}
                    </p>
                  </div>
                  {c.allFilled ? (
                    <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-red-500/10 text-red-400 border-red-500/25">
                      All vacancies filled
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/25">
                      {c.openVacancies} open
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/45">{c.description}</p>
                {!c.allFilled && (
                  <div className="flex flex-wrap gap-1.5">
                    {c.openRoles.map((r: any) => (
                      <span key={r._id} className="text-[11px] px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-300">
                        {r.title}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setCompanyId(c._id)}
                  className="bg-white/6 hover:bg-white/10 border border-white/10 text-sm font-semibold py-2.5 rounded-xl mt-1"
                >
                  View vacancies
                </button>
              </div>
            ))}
          </div>
        )}

        {/* all jobs */}
        {!companyId && tab === "jobs" && (
          <>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by role or skill..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-indigo-500/50"
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                <option value="All" className="bg-black">All vacancies</option>
                <option value="Open" className="bg-black">Open only</option>
                <option value="Filled" className="bg-black">Filled only</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs border ${
                    category === c
                      ? "bg-indigo-500/20 border-indigo-500/40 text-white"
                      : "border-white/10 text-white/50 hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {!loading && jobs.length === 0 && <p className="text-white/40 text-sm">No jobs found.</p>}
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((j) => (
                <JobCard key={j._id} job={j} onSave={toggleSave} onBook={openBooking} />
              ))}
            </div>
          </>
        )}

        {/* saved */}
        {!companyId && tab === "saved" && (
          <>
            {!loading && saved.length === 0 && (
              <p className="text-white/40 text-sm">You haven't saved any jobs yet.</p>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {saved.map((j) => (
                <JobCard key={j._id} job={j} onSave={toggleSave} onBook={openBooking} />
              ))}
            </div>
          </>
        )}

        {/* appointments */}
        {!companyId && tab === "appointments" && (
          <>
            {!loading && appointments.length === 0 && (
              <p className="text-white/40 text-sm">No interviews booked yet.</p>
            )}
            <div className="flex flex-col gap-3">
              {appointments.map((a) => (
                <div key={a._id} className="glass-card p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-white/90">{a.job?.title}</p>
                    <p className="text-sm text-white/45">
                      {a.company?.name} • {a.company?.location}
                    </p>
                    <p className="text-sm text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CalendarCheck size={14} /> {prettyDate(a.date)}, {a.slot}
                    </p>
                  </div>
                  <button
                    onClick={() => cancelAppointment(a._id)}
                    className="text-sm px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {booking && (
        <BookingModal
          job={booking.job}
          companyName={booking.companyName}
          onClose={() => setBooking(null)}
          onBooked={load}
        />
      )}
    </div>
  );
};

export default Jobs;