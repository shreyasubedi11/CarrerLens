import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { features } from "../utils";


const Login = () => {
 const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuth } = useAppData();

   const handleGoogleLogin = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${server}/api/user/login`, {
        code: authResult["code"],
      });

      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setLoading(false);
      setUser(result.data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(" login failed");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: handleGoogleLogin,
    flow: "auth-code",
  });
   return (
    <div className="bg-page flex items-center justify-center p-4">
      <div className="orb w-96 h-96 bg-indigo-500 -top-20 -left-20" />
      <div className="orb w-80 h-80 bg-emerald-500 bottom-10 right-0" />
      <div className="orb w-64 h-64 bg-violet-600 top-1/2 left-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md p-10 flex flex-col items-center gap-8 z-10
bg-[linear-gradient(135deg,rgba(125,162,234,0.25),rgba(245,237,228,0.10))]
backdrop-blur-2xl border border-white/10 rounded-2xl
shadow-[0_30px_80px_rgba(0,0,0,0.35)]
transition-all duration-300 h-0.5hover:translate-y-[-4px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-3xl">
            📚
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gradient">
            CareerLens
          </h1>
          <p className="text-white/40 text-sm leading-relaxed text-gradient">
            Your AI-powered career co-poilet - build, analyse, and land your
            next role.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {features.map(({ icon: Icon, label }) => (
            <span key={label} className="feature-pill">
              <Icon size={11} className="text-indigo-400" />
              {label}
            </span>
          ))}
        </div>

        <div className="divider-subtle"></div>

        <div className="w-full flex flex-col gap-2">
          <p className="text-center text-xs text-white/30 uppercase tracking-widest font-medium">
            Continue with
          </p>

          <button
            className="btn-google"
            onClick={googleLogin}
            disabled={loading}
          >
            {loading ? (
              <p className="text-gray-400 animate-pulse">Please Wait...</p>
            ) : (
              <>
                <img src="/google.svg" alt="" className="w-4 h-4" /> Sign in
                with Google
              </>
            )}
          </button>
        </div>

        <div className="text-[11px] text-white/25 text-center leading-relaxed">
          By signing in you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-white/50 transition-colors"
          >
            Terms
          </a>{" "}
          {"&"}{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-white/50 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
  
};

export default Login