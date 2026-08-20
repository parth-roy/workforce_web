import fs from 'fs';
import path from 'path';

const file = path.resolve('src/pages/shared/ContactPage.jsx');
let content = fs.readFileSync(file, 'utf8');

const oldContactsRegex = /const contacts = \[\s*\{[\s\S]*?\}\s*\];/;
const newContacts = `const contacts = [
    { 
      icon: MessageSquare, 
      label: 'WhatsApp', 
      value: '+91 9331488999', 
      note: 'Chat with our support team', 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      href: 'https://wa.me/919331488999?text=Hi%20there,%20I%20have%20an%20enquiry!'
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: '+91 9331488999', 
      note: 'Mon-Sat, 9AM-7PM', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      href: 'tel:+919331488999'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      value: 'hello@parthertech.com', 
      note: 'Drop us a line anytime', 
      color: 'text-slate-600', 
      bg: 'bg-slate-50', 
      border: 'border-slate-200',
      href: 'mailto:hello@parthertech.com'
    },
    { 
      icon: MapPin, 
      label: 'Office', 
      value: 'Barrackpore, WB', 
      note: '1/2, Bhattacharjee Para, West Bengal 700120', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200',
      href: 'https://maps.google.com/?q=1/2,+Bhattacharjee+Para,+Barrackpore,+West+Bengal+700120',
      target: '_blank'
    },
  ];`;

content = content.replace(oldContactsRegex, newContacts);

const oldMappingRegex = /\{contacts\.map\(\(\{ icon: Icon, label, value, note, color, bg, border \}\) => \([\s\S]*?\}\)\)/;
const newMapping = `{contacts.map(({ icon: Icon, label, value, note, color, bg, border, href, target }) => (
                <a 
                  key={label} 
                  href={href}
                  target={target || '_self'}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                  className={\`\${bg} border \${border} rounded-2xl p-6 block hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer\`}
                >
                  <div className={\`w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm\`}>
                    <Icon className={\`w-5 h-5 \${color}\`} />
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{label}</p>
                  <p className="font-semibold text-slate-700 mb-2">{value}</p>
                  <p className="text-xs text-slate-500 leading-tight">{note}</p>
                </a>
              ))}`;

content = content.replace(oldMappingRegex, newMapping);

fs.writeFileSync(file, content);
console.log("Updated ContactPage.jsx with clickable cards and correct credentials");
