const fs = require('fs');
const path = require('path');

const targetDir = 'd:\\PsarPulse\\app\\(dashboard)\\vendor\\pro';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Replace various indigo classes with psar-primary equivalents
            content = content.replace(/bg-indigo-50\b|bg-indigo-100\b/g, 'bg-psar-primary/10');
            content = content.replace(/bg-indigo-500\b|bg-indigo-600\b|bg-indigo-700\b/g, 'bg-psar-primary');
            content = content.replace(/text-indigo-500\b|text-indigo-600\b|text-indigo-700\b/g, 'text-psar-primary');
            content = content.replace(/border-indigo-100\b|border-indigo-200\b/g, 'border-psar-primary/20');
            content = content.replace(/border-indigo-500\b|border-indigo-600\b/g, 'border-psar-primary');
            content = content.replace(/ring-indigo-500\b/g, 'ring-psar-primary');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated colors in ${fullPath}`);
            }
        }
    }
}

processDirectory(targetDir);
console.log('Color fixed.');
