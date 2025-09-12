/**
 * A utility script to update all console.log calls in API routes to use dlog
 *
 * Usage:
 * node scripts/update-api-logs.js
 */

const fs = require('fs');
const path = require('path');

// Config
const API_DIR = path.join(__dirname, '..', 'app', 'api');
const LOGGER_IMPORT = `import { dlog } from '@/lib/logger';`;

// Helper to recursively find all .ts files
function findFiles(dir, filelist = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, filelist);
    } else if (file.endsWith('.ts')) {
      filelist.push(filePath);
    }
  }

  return filelist;
}

// Process a single file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let hasImport = false;

  // Check if there are any console.log calls
  const hasConsoleLog = /console\.log/g.test(content);
  if (!hasConsoleLog) {
    return false;
  }

  // Check if the logger is already imported
  hasImport = content.includes(LOGGER_IMPORT);

  // Replace console.log with dlog
  if (content.includes('console.log')) {
    content = content.replace(/console\.log/g, 'dlog');
    modified = true;
  }

  // Add import if needed
  if (modified && !hasImport) {
    const importMatch = content.match(/import\s+[^;]+;/g);
    if (importMatch && importMatch.length > 0) {
      // Find the last import statement
      const lastImport = importMatch[importMatch.length - 1];
      const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
      content =
        content.substring(0, lastImportIndex) +
        '\n' +
        LOGGER_IMPORT +
        content.substring(lastImportIndex);
    } else {
      // No imports found, add at the beginning of the file
      content = LOGGER_IMPORT + '\n\n' + content;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

// Main function
async function main() {
  console.log('🔍 Finding API route files...');
  const files = findFiles(API_DIR);
  console.log(`📂 Found ${files.length} files to process`);

  let modifiedCount = 0;

  for (const file of files) {
    try {
      const wasModified = processFile(file);
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
  console.log(
    `1. Add DEBUG_LOGS=0 to your .env.local file (set to 1 when you need debug logs)`
  );
  console.log(`2. Restart your development server`);
}

main().catch(console.error);
