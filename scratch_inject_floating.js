import fs from 'fs';
import path from 'path';

const file = path.resolve('src/AppRouter.jsx');
let content = fs.readFileSync(file, 'utf8');

// Inject the import
const importFooter = "import Footer from './components/layout/Footer.jsx';";
const importFloatingContact = "import FloatingContact from './components/layout/FloatingContact.jsx';";
content = content.replace(importFooter, `${importFooter}\n${importFloatingContact}`);

// Inject the component
const footerTag = "<Footer />";
content = content.replace(footerTag, `${footerTag}\n      <FloatingContact />`);

fs.writeFileSync(file, content);
console.log("Injected FloatingContact into AppRouter.jsx");
