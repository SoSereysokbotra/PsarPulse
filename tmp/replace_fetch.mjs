import fs from 'fs';
import path from 'path';

const dirs = [
  'd:/PsarPulse/app/(dashboard)/vendor',
  'd:/PsarPulse/components/vendor'
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /(?<!offline)(?<!\.)\bfetch\(/g;
      
      if (regex.test(content)) {
        let modified = content.replace(regex, 'offlineFetch(');
        
        if (!modified.includes('import { offlineFetch }')) {
            const matches = [...modified.matchAll(/^import .*$/gm)];
            if (matches.length > 0) {
              const lastMatch = matches[matches.length - 1];
              const insertPos = lastMatch.index + lastMatch[0].length;
              modified = modified.slice(0, insertPos) + '\nimport { offlineFetch } from "@/lib/pwa/offline-fetch";' + modified.slice(insertPos);
            } else {
              modified = 'import { offlineFetch } from "@/lib/pwa/offline-fetch";\n' + modified;
            }
        }
        
        fs.writeFileSync(fullPath, modified);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

for (const dir of dirs) {
  processDir(dir);
}
