import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { useAppData } from "../context/AppContext";

function Hero(){
    const {isAuth} = useAppData()
    return (  <section className="relative pt-36 pb-28 px-6 flex flex-col items-center text-center overflow-hidden">
  <div
        className="orb w-150 h-150 bg-indigo-600 -top-40 left-1/2 -translate-x-1/2"
        style={{ opacity: 0.12 }}
      />
 <div
        className="orb w-80 h-80 bg-emerald-500 bottom-0 right-10"
        style={{ opacity: 0.1 }}
      />
   <div className="inline-flex items-center gap-2 feature-pill mb-6 animate-fade-in">
        <Zap size={11} className="text-emerald-400" />
        <span className="text-orange-300">AI-Powered Career Platform</span>
      </div>
 
 <h1
        className="text-4xl md:text-6xl lg:text-7xl font-extrabold 
        leading-[1.08] tracking-tight max-w-4xl mb-6 animate-slide-up"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Land Your Dream Job
        <br />
        <span className="text-gradient">Faster with AI</span>
      </h1>

 <p
        className="text-white/45 text-lg md:text-xl max-w-xl leading-relaxed mb-10 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        Analyse your resume, get an ATS score, discover the right jobs, build a
        stunning resume, and ace every interview - all in one place.
      </p>
    

<div
        className="flex flex-col sm:flex-row items-center gap-3 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <Link
          to={isAuth ? "/jobmatcher" : "/login"}
          className="btn-primary px-7 py-3.5 rounded-xl text-base font-semibold"
        >
          {isAuth ? (
            <p className="flex items-center gap-2">
              Find Best Job <ArrowRight size={16} />
            </p>
          ) : (
            <p className="flex items-center gap-2">
              Start for free <ArrowRight size={16} />
            </p>
          )}
        </Link>
        <a
          href="#features"
          className="text-sm text-white/45 hover:text-white transition-colors flex items-center gap-1.5"
        >
          See how it works <ChevronRight size={14} />
        </a>
      </div>


 <p className="text-white/35 text-xs mt-6">
        First 3 analyses free • No credit card required
      </p>

      <div
  className="mt-16 glass-card px-8 py-6 flex items-center gap-8 animate-slide-up relative"
  style={{ animationDelay: "0.3s" }}
>
  {/* Circular ATS Score */}
  <div className="relative flex items-center justify-center">
    {(() => {
      const score = 87;
      const radius = 60;
      const stroke = 8;
      const normalizedRadius = radius - stroke * 2;
      const circumference = normalizedRadius * 2 * Math.PI;
      const strokeDashoffset =
        circumference - (score / 100) * circumference;

      return (
        <>
          <svg height={radius * 2} width={radius * 2}>
            {/* background ring */}
            <circle
              stroke="rgba(255,255,255,0.1)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            {/* progress ring */}
            <circle
              stroke="#ff7a18"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* center text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span
              className="text-3xl font-black text-gradient"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {score}
            </span>
            <span className="text-[10px] text-white/40 tracking-widest uppercase">
              ATS Score
            </span>
          </div>
        </>
      );
    })()}
  </div>

  {/* Divider */}
  <div className="h-12 w-px bg-white/10" />

  {/* Insights */}
  <div className="flex flex-col gap-2 text-left">
    <span className="text-xs font-medium text-emerald-300">
      ✔ Strong keywords detected
    </span>
    <span className="text-xs font-medium text-orange-300">
      📈 Top 20% resume
    </span>
    <span className="text-xs text-white/40 font-medium">
      3 job matches found
    </span>
  </div>
</div>
</section>
    );
}


export default Hero