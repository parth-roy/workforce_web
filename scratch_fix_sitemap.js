import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, searchRegex, replacement) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(searchRegex, replacement);
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

// 1. Update mock data indexabilityStatus
replaceInFile('src/data/mock/roles.js', /'not-yet-eligible'/g, "'eligible'");
replaceInFile('src/data/mock/services.js', /'not-yet-eligible'/g, "'eligible'");
replaceInFile('src/data/mock/locations.js', /'not-yet-eligible'/g, "'eligible'");

// 2. Fix generate-sitemap.js canonical typo
replaceInFile('scripts/generate-sitemap.js', /canonical: '\/about'/g, "canonicalPath: '/about'");
replaceInFile('scripts/generate-sitemap.js', /canonical: '\/contact'/g, "canonicalPath: '/contact'");
replaceInFile('scripts/generate-sitemap.js', /canonical: '\/faq'/g, "canonicalPath: '/faq'");
replaceInFile('scripts/generate-sitemap.js', /canonical: '\/guides'/g, "canonicalPath: '/guides'");

// 3. Add ServiceHiringFlowSEO to generate-sitemap.js
const sitemapPath = path.resolve('scripts/generate-sitemap.js');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
if (!sitemapContent.includes('ServiceHiringFlowSEO(s)')) {
  // Find a good place to insert, e.g., after IndividualServiceSEO
  sitemapContent = sitemapContent.replace(
    /mockServices\.forEach\(s => addUrl\(IndividualServiceSEO\(s\)\)\);/,
    "mockServices.forEach(s => addUrl(IndividualServiceSEO(s)));\n  mockServices.forEach(s => addUrl(ServiceHiringFlowSEO(s)));"
  );
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log("Added ServiceHiringFlowSEO to generate-sitemap.js");
}
