import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pages from '../src/data/pages.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://workforce.gomytruck.com'

function generateSitemap() {
  const currentDate = new Date().toISOString()
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`

  // SEO Pages
  pages.forEach(page => {
    // Determine priority based on template type
    const priority = page.template === 'employer' ? '0.9' : '0.8'
    
    xml += `  <url>
    <loc>${BASE_URL}/${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>
`
  })

  xml += `</urlset>`

  const publicDir = path.join(__dirname, '../public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml)
  console.log(`✅ Generated sitemap.xml with ${pages.length + 1} URLs`)
  
  // Also generate robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots)
  console.log('✅ Generated robots.txt')
}

generateSitemap()
