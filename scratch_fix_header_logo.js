import fs from 'fs';
import path from 'path';

const file = path.resolve('src/components/layout/Header.jsx');
let content = fs.readFileSync(file, 'utf8');

// Replace the logo in Header.jsx
const oldLogoRegex = /<Link to="\/" className="flex items-center gap-2 group z-50">[\s\S]*?<\/Link>/;
const newLogo = `<Link to="/" className="flex items-center gap-2 group z-50 shrink-0">
          <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-10 object-contain" />
          <span className="font-black text-2xl tracking-tight leading-none mt-1 text-slate-900">
            Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
          </span>
        </Link>`;

content = content.replace(oldLogoRegex, newLogo);

// Also replace the mobile drawer logo
const mobileLogoRegex = /<div className="h-20 border-b border-slate-100 flex items-center px-6">[\s\S]*?<\/div>/;
const newMobileLogo = `<div className="h-20 border-b border-slate-100 flex items-center px-6 gap-2">
          <img src="/logo.png" alt="Metro Mitra Logo" className="h-8 w-8 object-contain" />
          <span className="font-black text-xl tracking-tight leading-none mt-1 text-slate-900">
            Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
          </span>
        </div>`;

content = content.replace(mobileLogoRegex, newMobileLogo);

fs.writeFileSync(file, content);
console.log("Updated logo in Header.jsx");
