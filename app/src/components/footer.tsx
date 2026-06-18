function Footer() {
  return (
    <footer className="mt-20 px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/45 text-xs 
bg-[#18245a]/95 backdrop-blur-xl border-t border-white/10">
      <span
        style={{ fontFamily: "'Syne', sans-serif" }}
        className="font-bold text-white/40 text-sm"
      >
        CareerLens
      </span>
      <span>©️ {new Date().getFullYear()} CareerLens. All rights reserved.</span>
      <div className="flex gap-5">
        {["Privacy", "Terms", "Contact"].map((i) => (
          <a key={i} href="#" className="hover:text-white/80 transition-colors">
            {i}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;