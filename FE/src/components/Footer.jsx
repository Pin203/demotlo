export default function Footer() {
  return (
    <footer className="w-full bg-[#070b0e] text-cyan-400">
      {/* 1. Viền SVG góc cạnh nhọn màu vàng nối giữa Body và Footer */}
      <div className="w-full overflow-hidden leading-none bg-[#e8ed00]">
        <svg 
          viewBox="0 0 1200 30" 
          className="w-full h-8 text-[#070b0e] fill-current"
          preserveAspectRatio="none"
        >
          {/* Vẽ các nét răng cưa vát góc Cyberpunk */}
          <polygon points="0,30 0,10 120,10 140,30 350,30 365,5 500,5 515,30 800,30 820,10 1200,10 1200,30" />
        </svg>
      </div>

      {/* 2. Nội dung Footer */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hàng 1: Social & Partners */}
        <div className="flex flex-wrap items-center justify-between border-b border-cyan-900/40 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white tracking-widest text-sm">RETROUVEZ-NOUS SUR</span>
            {/* Các Icon MXH */}
          </div>
          <div className="flex items-center gap-6 opacity-80">
            {/* Logo Nvidia, Alienware, AMD... */}
          </div>
        </div>

        {/* Hàng 2: Links */}
        <div className="flex flex-wrap gap-6 py-6 text-sm font-semibold border-b border-cyan-900/40">
          <a href="#" className="hover:text-white transition">Conditions d'utilisation</a>
          <a href="#" className="hover:text-white transition">Offres d'emploi</a>
          <a href="#" className="hover:text-white transition">Directives</a>
        </div>

        {/* Hàng 3: Copyright */}
        <div className="pt-6 flex flex-wrap justify-between items-center text-xs text-gray-400">
          <p>© 2026 CD PROJEKT RED S.A. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}