import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Files to copy to dist directory for Chrome extension
const filesToCopy = [
  'manifest.json',
  'content.js',
  'background.js'
];

// Directories to copy
const dirsToCopy = [
  'public'
];

console.log('Copying extension files to dist directory...');

// Ensure dist directory exists
const distDir = path.join(projectRoot, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy individual files
filesToCopy.forEach(file => {
  const srcPath = path.join(projectRoot, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file}`);
  } else {
    console.warn(`⚠ File not found: ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const srcPath = path.join(projectRoot, dir);
  const destPath = path.join(distDir, dir);
  
  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, destPath);
    console.log(`✓ Copied directory ${dir}`);
  } else {
    console.warn(`⚠ Directory not found: ${dir}`);
  }
});

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Extension files copied successfully!');
console.log('You can now load the extension from the dist directory in Chrome.');

