import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuth, user } = useAppData();

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6
md:px-12 py-4 bg-[#18245a]/98 backdrop-blur-xl border-b border-white/10"
    >
      <Link to={"/"} className="flex place-items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#18245a] flex justify-center items-center shadow-lg text-2xl">
          📚
        </div>
        <span
          className="font-bold text-lg tracking-tight"
          style={{ fontFamily: " 'Syne', sans-serif" }}
        >
          Career
          <span className="text-gradient">Lens</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
        <Link to={"/analyse"} className="hover:text-white transition-colors">
          Analyse
        </Link>

        <Link to={"/jobmatcher"} className="hover:text-white transition-colors">
          JobMatcher
        </Link>

        <Link to={"/resumebuilder"} className="hover:text-white transition-colors">
          ResumeBuilder
        </Link>

        <Link to={"/interviewprep"} className="hover:text-white transition-colors">
          InterviewPrep
        </Link>

        <Link to={"/jobs"} className="hover:text-white transition-colors">
          Jobs
        </Link>

        <Link to={"/faq"} className="hover:text-white transition-colors">
          FAQ
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {isAuth ? (
          <Link
            to={"/account"}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="user.png"
              alt=""
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
            />
            <span className="text-sm text-white/70">
              {user?.name?.split(" ")[0]}
            </span>
          </Link>
        ) : (
          <>
            <Link
              to={"/login"}
              className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>

            <Link to={"/login"} className="btn-primary text-sm px-5 py-2 rounded-lg">
              Get Started Free
            </Link>
          </>
        )}
      </div>

      {/* mobile view */}
      <button
        className="md:hidden text-white/60 hover:text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute top-full inset-x-0 bg-[#080b14]/95 backdrop-blur-xl border-b border-white/6 flex flex-col gap-4 px-6 py-6 md:hidden">
          <Link
            to={"/analyse"}
            onClick={() => setOpen(false)}
            className="hover:text-white transition-colors"
          >
            Analyse
          </Link>
          <Link
            to={"/jobmatcher"}
            onClick={() => setOpen(false)}
            className="hover:text-white transition-colors"
          >
            JobMatcher
          </Link>
          <Link
            to={"/resumebuilder"}
            onClick={() => setOpen(false)}
            className="hover:text-white transition-colors"
          >
            ResumeBuilder
          </Link>
          <Link
            to={"/interviewprep"}
            onClick={() => setOpen(false)}
            className="hover:text-white transition-colors"
          >
            InterviewPrep
          </Link>
          <Link
            to={"/jobs"}
            onClick={() => setOpen(false)}
            className="hover:text-white transition-colors"
          >
            Jobs
          </Link>
          <Link
            to={"/faq"}
            onClick={() => setOpen(false)}
            className="hover:text-white transition-colors"
          >
            FAQ
          </Link>

          {isAuth ? (
            <Link
              to={"/account"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src="/user.png"
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
              />
              <span className="text-sm text-white/70">
                {user?.name?.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <>
              <Link
                to={"/login"}
                onClick={() => setOpen(false)}
                className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                to={"/login"}
                onClick={() => setOpen(false)}
                className="btn-primary text-sm px-5 py-2 rounded-lg"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;