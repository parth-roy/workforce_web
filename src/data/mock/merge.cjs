const fs = require('fs');
let content = fs.readFileSync('src/data/mock/ucServicesData.js', 'utf8');
const extraContent = fs.readFileSync('src/data/mock/extra.txt', 'utf8');

// The original file ends with:
//         ]
//       }
//     ]
//   }
// };
// We want to replace "  }\n};" with "  },\n" + extraContent + "\n};\n"
content = content.replace(/\s*}\n};\s*$/, '\n  },\n' + extraContent + '\n};\n');
fs.writeFileSync('src/data/mock/ucServicesData.js', content);
console.log('Successfully merged extra services.');
