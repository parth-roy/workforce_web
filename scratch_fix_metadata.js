import fs from 'fs';
import path from 'path';

const file = path.resolve('src/seo/pageMetadata.js');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /export function IndividualServiceLocationSEO\(service, location\) {\s*const path = [^;]+;\s*const title = [^;]+;\s*const description = [^;]+;\s*const indexable = resolveIndexable\('not-yet-eligible'\);/g,
  (match) => match.replace(
    "const indexable = resolveIndexable('not-yet-eligible');", 
    "const indexable = resolveIndexable(service.indexabilityStatus) && resolveIndexable(location.indexabilityStatus);"
  )
);

content = content.replace(
  /export function B2BServiceLocationSEO\(service, location\) {\s*const path = [^;]+;\s*const title = [^;]+;\s*const description = [^;]+;\s*const indexable = resolveIndexable\('not-yet-eligible'\);/g,
  (match) => match.replace(
    "const indexable = resolveIndexable('not-yet-eligible');", 
    "const indexable = resolveIndexable(service.indexabilityStatus) && resolveIndexable(location.indexabilityStatus);"
  )
);

fs.writeFileSync(file, content);
console.log("Fixed hardcoded indexability status in IndividualServiceLocationSEO and B2BServiceLocationSEO");
