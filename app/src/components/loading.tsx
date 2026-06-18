export default function Loading(){
   
  return (
    <div className="bg-page flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-emerald-400 animate-pulse shadow-lg shadow-indigo-500/30"></div>
        <p className="text-white/30 text-sm tracking-widest uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
} 