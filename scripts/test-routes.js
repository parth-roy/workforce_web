import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routerPath = path.resolve(__dirname, '../src/AppRouter.jsx');

const requiredRoutes = [
  '<Route path="/"',
  '<Route path="/jobs"',
  '<Route path="/jobs/roles"',
  '<Route path="/jobs/:role"',
  '<Route path="/jobs/location/:location"',
  '<Route path="/jobs/:role/:location"',
  '<Route path="/jobs/detail/:jobId"',
  '<Route path="/join-as-worker"',
  '<Route path="/workers/how-it-works"',
  '<Route path="/workers/faq"',
  '<Route path="/services"',
  '<Route path="/services/categories"',
  '<Route path="/services/how-it-works"',
  '<Route path="/services/faq"',
  '<Route path="/services/:service"',
  '<Route path="/services/:service/hire"',
  '<Route path="/services/:service/:location"',
  '<Route path="/hire-workers"',
  '<Route path="/hire-workers/:service"',
  '<Route path="/hire-workers/:service/:location"',
  '<Route path="/for-contractors"',
  '<Route path="/for-companies"',
  '<Route path="/about"',
  '<Route path="/contact"',
  '<Route path="/faq"',
  '<Route path="/guides"'
];

function testRoutes() {
  const routerContent = fs.readFileSync(routerPath, 'utf8');
  let failed = false;

  for (const route of requiredRoutes) {
    if (!routerContent.includes(route)) {
      console.error(`? Route Contract Test Failed: Missing route definition for ${route}`);
      failed = true;
    } else {
      console.log(`? Route found: ${route}`);
    }
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log('? All required routes are registered in AppRouter.jsx');
  }
}

testRoutes();
