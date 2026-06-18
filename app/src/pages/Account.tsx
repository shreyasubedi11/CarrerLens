
import { Calendar, Crown, LogOut, Mail, Zap} from "lucide-react";
import { useAppData } from "../context/AppContext";
import { HashLink } from "react-router-hash-link";


const Account = () => {
  const { user, LogoutUser } = useAppData();

  const isPro = user?.subscription && new Date() < new Date(user.subscription);
  const freeLeft = Math.max(0, 3 - (user?.freeRequestsUsed ?? 0));

  console.log(freeLeft);
  return (
    <div className="bg-page flex items-start justify-center px-4 pt-28 pb-12">
      <div className="w-full max-w-xl flex flex-col gap-5">
        <div className="glass-card p-6 flex items-center gap-4">
          <img
            src="/user.png"
            alt="xyz"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10"
          />

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg truncate">{user?.name}</h2>
            <p className="text-white/40 text-sm flex items-center gap-1.5 truncate">
              <Mail size={12} /> {user?.email}
            </p>
          </div>
          <button
            className="feature-pill gap-2 text-red-400 border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer"
            onClick={LogoutUser}
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
 <div
          className={`glass-card p-6 flex items-center gap-4 ${
            isPro ? "border-emerald-500/25" : "border-white/8"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isPro ? "bg-emerald-500/15" : "bg-white/5"
            }`}
          >
            {isPro ? (
              <Crown size={20} className="text-emerald-400" />
            ) : (
              <Zap size={20} className="text-white/40" />
            )}
          
          </div>
          <div className="flex-1">
            <p className="font-semibold">{isPro ? "Pro Plan" : "Free Plan"}</p>
            {isPro ? (
              <p className="text-white/40 text-sm flex items-center gap-1.5 mt-0.5">
                <Calendar size={12} /> Expires{" "}
                {new Date(user!.subscription!).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : (
              <p className="text-white/40 text-sm mt-0.5">
                {freeLeft} of 3 free request remaining
              </p>
            )}
          
          
          </div>
 {!isPro && (
            <HashLink
              to={"/#pricing"}
              className="btn-primary text-xs font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
            >
              Upgrade
            </HashLink>
          )}
       </div>
 {!isPro && (
          <div className="glass-card p-6 flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Free requests used</span>
              <span className="text-white/70 font-medium">
                {user?.freeRequestsUsed ?? 0}/3
              </span>
            </div>
 <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
  <div
                className="h-full bg-linear-to-r from-orange-700 to-orange-200 rounded-full transition-all duration-500"
                style={{
                  width: `${((user?.freeRequestsUsed ?? 0) / 3) * 100}%`,
                }}
              />
              {freeLeft === 0 && (
                <p className="text-xs text-amber-400/80">
                  You have used all free requests. Upgrade to continue
                </p>
              )}

      </div>
 
    </div>
    )}
    </div>
    </div>
  );
};

export default Account;