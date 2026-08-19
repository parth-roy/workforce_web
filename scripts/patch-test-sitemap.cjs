const fs = require('fs');
let code = fs.readFileSync('scripts/test-sitemap.js', 'utf8');

const replacement = `
  function checkConsistency(seoMetadata) {
    let cleanPath = seoMetadata.canonicalPath;
    if (cleanPath !== '/') {
      if (cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
      }
    } else {
      cleanPath = '';
    }
    const canonicalUrl = \`\${BASE_URL}\${cleanPath}\`;
    const inSitemap = sitemapUrlSet.has(canonicalUrl);

    if (seoMetadata.indexable === true) {
      assert(inSitemap, \`URL should be in sitemap but is missing: \${canonicalUrl}\`);
    } else {
      assert(!inSitemap, \`URL is not eligible but was found in sitemap: \${canonicalUrl}\`);
    }
  }
`;

code = code.replace(/function checkConsistency\(seoMetadata\) \{[\s\S]*?\}\s*\}/, replacement);
fs.writeFileSync('scripts/test-sitemap.js', code);
