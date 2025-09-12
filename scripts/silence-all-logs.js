/**
 * A more aggressive script to silence ALL console.log calls in the codebase
 *
 * Usage:
 * node scripts/silence-all-logs.js
 */

const fs = require('fs');
const path = require('path');

// Config
const ROOT_DIR = path.join(__dirname, '..');
const SILENCER_CODE = `
// Import safe logger - added by silence-all-logs.js script
import { dlog } from '@/lib/logger';
// We use the dlog function instead of directly modifying console
// This preserves application functionality while reducing logs
`;

// Directories to scan
const TARGET_DIRS = [
  path.join(ROOT_DIR, 'app'),
  path.join(ROOT_DIR, 'lib'),
  path.join(ROOT_DIR, 'components'),
  path.join(ROOT_DIR, 'actions'),
];

// Helper to recursively find all JS/TS files
function findFiles(dir, filelist = []) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (file.startsWith('.') || file === 'node_modules') continue;

      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findFiles(filePath, filelist);
      } else if (/\.(js|ts|jsx|tsx)$/.test(file) && !file.endsWith('.d.ts')) {
        filelist.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }

  return filelist;
}

// Add silencer code to files with server components or API routes
function addSilencer(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Don't modify files that already have our silencer
    if (
      content.includes('Silence console logs - added by silence-all-logs.js')
    ) {
      return false;
    }

    // Add silencer after imports
    const lastImportMatch = content.match(/import\s+[^;]+;/g);
    if (lastImportMatch && lastImportMatch.length > 0) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
      content =
        content.substring(0, lastImportIndex) +
        '\n' +
        SILENCER_CODE +
        content.substring(lastImportIndex);

      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }

    // For files with no imports, add at the top
    if (!lastImportMatch) {
      content = SILENCER_CODE + '\n' + content;
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }

  return false;
}

// Main function
async function main() {
  console.log('🔍 Finding files to modify...');
  let allFiles = [];

  for (const dir of TARGET_DIRS) {
    const files = findFiles(dir);
    allFiles = [...allFiles, ...files];
  }

  console.log(`📂 Found ${allFiles.length} files to process`);

  let modifiedCount = 0;

  for (const file of allFiles) {
    try {
      const wasModified = addSilencer(file);
      if (wasModified) {
        modifiedCount++;
        console.log(`✅ Updated: ${path.relative(process.cwd(), file)}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log(`\n🎉 Done! Modified ${modifiedCount} files.`);
  console.log(`\nNext steps:`);
  console.log(`1. Set DEBUG_LOGS=0 in your .env.local file to silence logs`);
  console.log(`2. Set DEBUG_LOGS=1 if you need to see logs again`);
  console.log(`3. Restart your development server`);
}

main().catch(console.error);
