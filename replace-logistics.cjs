const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    // Specifically fix the hero section headline
    .replace(/Logistics Gig Platform/g, "Gig Platform")
    .replace(/logistics gig platform/gi, "gig platform")
    
    // Replace "Logistics Workforce" -> "Gig Workforce"
    .replace(/Logistics Workforce/g, "Gig Workforce")
    .replace(/logistics workforce/g, "gig workforce")
    .replace(/Logistics workforce/g, "Gig workforce")
    
    // Some places might just say "logistics workers"
    .replace(/Logistics Workers/g, "Gig Workers")
    .replace(/logistics workers/g, "gig workers")
    
    // In meta descriptions or texts
    .replace(/Logistics jobs/g, "Gig jobs")
    .replace(/logistics jobs/g, "gig jobs");

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

walk('src');
