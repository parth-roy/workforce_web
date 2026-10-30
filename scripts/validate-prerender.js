import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INDEXABLE_ROUTES } from "../src/route-manifest.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = "https://metromitra.com";
const errors = [];

const count = (source, pattern) => (source.match(pattern) || []).length;
const attribute = (html, selectorPattern, name) => {
  const tag = html.match(selectorPattern)?.[0] || "";
  return tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
};

console.log(`🔍 Validating ${INDEXABLE_ROUTES.length} routes in dist/...`);

// Sample validation: if thousands of routes, validate sample + all core
const coreRoutes = INDEXABLE_ROUTES.slice(0, 100);
// Also sample 50 services, 50 jobs, 50 b2b, 50 locations
const sampleRoutes = new Set([
  ...coreRoutes,
  ...INDEXABLE_ROUTES.filter(r => r.startsWith('/services/')).slice(0, 50),
  ...INDEXABLE_ROUTES.filter(r => r.startsWith('/jobs/')).slice(0, 50),
  ...INDEXABLE_ROUTES.filter(r => r.startsWith('/hire-workers/')).slice(0, 50),
]);

for (const route of sampleRoutes) {
  const relative = route === "/" ? "index.html" : path.join(route.slice(1), "index.html");
  const file = path.join(root, "dist", relative);

  if (!fs.existsSync(file)) {
    errors.push(`${route}: missing ${relative}`);
    continue;
  }

  const html = fs.readFileSync(file, "utf8");
  const ALIAS_CANONICALS = {
    '/locations': `${baseUrl}/directory`,
  };
  const expectedCanonical = ALIAS_CANONICALS[route] || (route === "/" ? `${baseUrl}` : `${baseUrl}${route}`);
  const canonical = attribute(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/i, "href");
  const description = attribute(html, /<meta\b[^>]*name=["']description["'][^>]*>/i, "content");
  const robots = attribute(html, /<meta\b[^>]*name=["']robots["'][^>]*>/i, "content") || "";

  if (!/<title\b[^>]*>[^<]{8,}<\/title>/i.test(html)) {
    errors.push(`${route}: missing or short title`);
  }
  if (!description || description.length < 25) {
    errors.push(`${route}: missing or short description`);
  }
  const isCanonicalValid = canonical === expectedCanonical || canonical === `${expectedCanonical}/` || (route === "/" && (canonical === baseUrl || canonical === `${baseUrl}/`));
  if (!isCanonicalValid) {
    errors.push(`${route}: canonical is ${canonical || "missing"}, expected ${expectedCanonical}`);
  }
  if (/Future integration:/i.test(html)) {
    errors.push(`${route}: contains developer placeholder text!`);
  }
  if (robots.includes("noindex") && !route.includes("demo")) {
    errors.push(`${route}: unexpectedly marked noindex!`);
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${route}: invalid JSON-LD (${error.message})`);
    }
  }
}

const notFound = path.join(root, "dist", "404.html");
if (!fs.existsSync(notFound)) {
  errors.push("404.html: missing in dist/");
}

if (errors.length) {
  console.error(`❌ SEO validation gate failed with ${errors.length} issue(s):`);
  errors.slice(0, 20).forEach((error) => console.error(`  - ${error}`));
  if (errors.length > 20) console.error(`  ... and ${errors.length - 20} more`);
  process.exit(1);
}

console.log(`✅ SEO validation gate passed successfully for sampled routes!`);
