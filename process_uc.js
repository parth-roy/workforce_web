import fs from 'fs';
import path from 'path';
import util from 'util';
import sharp from 'sharp';
import { ucServicesData } from './src/data/mock/ucServicesData.js';

const DOWNLOADS_DIR = 'C:/Users/chanc/Downloads';
const PUBLIC_ITEMS_DIR = './public/uc-images/items';
const PUBLIC_OPTIONS_DIR = './public/uc-images/options';

// Normalize string for matching
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  const folders = fs.readdirSync(DOWNLOADS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const serviceId of ['electrician', 'plumber']) {
    const service = ucServicesData[serviceId];
    if (!service) continue;

    for (const category of service.categories) {
      for (const item of category.items) {
        // Find matching folder
        const itemNorm = normalize(item.title);
        const matchedFolder = folders.find(f => {
          const fnorm = normalize(f);
          // Stronger matching rule:
          return fnorm === itemNorm || 
                 fnorm.includes(itemNorm) || 
                 itemNorm.includes(fnorm) ||
                 (itemNorm.includes('fan') && fnorm.includes('fan') && itemNorm.split(' ')[0] === fnorm.split(' ')[0]);
        });
        
        if (matchedFolder) {
          console.log(`Matched Item: ${item.title} -> Folder: ${matchedFolder}`);
          const folderPath = path.join(DOWNLOADS_DIR, matchedFolder);
          
          // 1. Process Main Image
          const filesInDir = fs.readdirSync(folderPath, { withFileTypes: true })
            .filter(d => d.isFile() && /\.(jpg|jpeg|png|webp|avif)$/i.test(d.name));
            
          if (filesInDir.length > 0) {
            const mainImgPath = path.join(folderPath, filesInDir[0].name);
            const outMainName = `${item.id}.webp`;
            const outMainPath = path.join(PUBLIC_ITEMS_DIR, outMainName);
            await sharp(mainImgPath).resize(400).webp({ quality: 80 }).toFile(outMainPath);
            item.image = `/uc-images/items/${outMainName}`;
          }

          // 2. Process Options
          const optionsFolder = path.join(folderPath, 'items');
          if (fs.existsSync(optionsFolder)) {
            const optionFiles = fs.readdirSync(optionsFolder, { withFileTypes: true })
              .filter(d => d.isFile() && /\.(jpg|jpeg|png|webp|avif)$/i.test(d.name));
              
            if (optionFiles.length > 0) {
              // Save a default template from existing option
              const defaultOpt = item.options.length > 0 ? item.options[0] : { price: 299, time: '30 mins', rating: '4.8 (1K reviews)' };
              
              const newOptions = [];
              for (let i = 0; i < optionFiles.length; i++) {
                const optFile = optionFiles[i];
                const optName = optFile.name.replace(/\.[^/.]+$/, ""); // strip extension
                
                const optId = `${item.id}-${i+1}`;
                const outOptName = `${optId}.webp`;
                const outOptPath = path.join(PUBLIC_OPTIONS_DIR, outOptName);
                
                await sharp(path.join(optionsFolder, optFile.name))
                  .resize(200)
                  .webp({ quality: 80 })
                  .toFile(outOptPath);
                  
                newOptions.push({
                  id: optId,
                  title: optName, // Title exactly from file name
                  price: defaultOpt.price,
                  time: defaultOpt.time,
                  rating: defaultOpt.rating,
                  image: `/uc-images/options/${outOptName}`
                });
              }
              item.options = newOptions;
            }
          }
        }
      }
    }
  }

  // Also check direct images in downloads that might match an item but aren't in a folder
  const allDownloadFiles = fs.readdirSync(DOWNLOADS_DIR, { withFileTypes: true })
    .filter(d => d.isFile() && /\.(jpg|jpeg|png|webp|avif)$/i.test(d.name));
    
  for (const serviceId of ['electrician', 'plumber']) {
    const service = ucServicesData[serviceId];
    if (!service) continue;
    for (const category of service.categories) {
      for (const item of category.items) {
        const itemNorm = normalize(item.title);
        // If it still has unsplash image, try to find a matching file
        if (item.image.includes('unsplash')) {
           const matchedFile = allDownloadFiles.find(f => {
             const fnameNorm = normalize(f.name.replace(/\.[^/.]+$/, ""));
             return fnameNorm === itemNorm || (fnameNorm.length > 6 && (fnameNorm.includes(itemNorm) || itemNorm.includes(fnameNorm)));
           });
           
           if (matchedFile) {
             console.log(`Matched Orphan File: ${item.title} -> File: ${matchedFile.name}`);
             const mainImgPath = path.join(DOWNLOADS_DIR, matchedFile.name);
             const outMainName = `${item.id}.webp`;
             const outMainPath = path.join(PUBLIC_ITEMS_DIR, outMainName);
             await sharp(mainImgPath).resize(400).webp({ quality: 80 }).toFile(outMainPath);
             item.image = `/uc-images/items/${outMainName}`;
           }
        }
      }
    }
  }

  // Rewrite the file
  const newContent = 'export const ucServicesData = ' + util.inspect(ucServicesData, { depth: null, maxArrayLength: null }) + ';\n';
  fs.writeFileSync('src/data/mock/ucServicesData.js', newContent, 'utf8');
  console.log('Finished updating data!');
}

run().catch(console.error);
