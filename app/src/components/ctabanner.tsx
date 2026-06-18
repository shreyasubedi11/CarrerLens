import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTABanner = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto glass-card p-12 text-center relative overflow-hidden">
        <div
          className="orb w-64 h-64 bg-indigo-500 -top-10 -left-10"
          style={{ opacity: 0.15 }}
        ></div>
        <div
          className="orb w-48 h-48 bg-emerald-500 -bottom-10 -right-10"
          style={{ opacity: 0.15 }}
        ></div>
        <h2
          className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Your next job is
          <br />
          <span className="text-gradient">waiting for you.</span>
        </h2>
        <p className="text-white/40 mb-8 relative z-10">
          Join thousands of job seekers using CarrerAI to get hired faster.
        </p>
        <Link
          to={"/analyse"}
          className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold relative z-10"
        >
          Analyse My Resume Free <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default CTABanner;