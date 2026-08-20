import fs from 'fs';
import path from 'path';

const file = path.resolve('src/components/layout/Footer.jsx');
let content = fs.readFileSync(file, 'utf8');

const oldFooterLogoRegex = /<div className="mb-4 md:mb-0">[\s\S]*?<span className="text-white font-black text-xl mr-4">Metro Mitra<\/span>[\s\S]*?<\/div>/;
const newFooterLogo = `<div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/logo.png" alt="Metro Mitra Logo" className="h-8 w-8 object-contain" />
            <span className="font-black text-xl tracking-tight leading-none mt-1 text-white mr-4">
              Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
            </span>
          </div>`;

content = content.replace(oldFooterLogoRegex, newFooterLogo);

fs.writeFileSync(file, content);
console.log("Updated logo in Footer.jsx");
