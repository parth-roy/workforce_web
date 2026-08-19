const fs = require('fs');
let code = fs.readFileSync('src/seo/pageMetadata.js', 'utf8');
code = code.replace(/from '\.\.\/data\/schema-helpers';/g, "from '../data/schema-helpers.js';");
fs.writeFileSync('src/seo/pageMetadata.js', code);
