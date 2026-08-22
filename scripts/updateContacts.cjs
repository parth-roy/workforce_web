const fs = require('fs');

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = dir + '/' + file;
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.jsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walkSync('./src');
files.forEach(file => {
  if (file.includes('Header.jsx') || file.includes('Footer.jsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  const linkRegex = /(<(?:Link|a)[^>]*>)\s*(Contact(?: Support| Us)?)\s*(<\/(?:Link|a)>)/gi;
  
  content = content.replace(linkRegex, (match, openTag, text, closeTag) => {
    if (match.includes('Phone') || match.includes('<svg')) return match;
    
    let newOpenTag = openTag;
    if (openTag.includes('className=')) {
      newOpenTag = openTag.replace(/className=(['"])(.*?)\1/, 'className=$1$2 flex items-center justify-center gap-2$1');
    } else {
      newOpenTag = openTag.replace(/>$/, ' className="flex items-center justify-center gap-2">');
    }
    return newOpenTag + '<Phone size={18} /> ' + text + closeTag;
  });
  
  if (content !== originalContent) {
    if (!content.includes('import { Phone }') && !content.includes('Phone } from')) {
      if (content.includes('lucide-react')) {
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/, 'import { $1, Phone } from "lucide-react"');
      } else {
        content = 'import { Phone } from "lucide-react";\n' + content;
      }
    }
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
