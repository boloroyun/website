/**
 * A utility script to update all console.log calls in API routes to use the new logger
 *
 * Usage:
 * node scripts/update-console-logs.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Config
const API_DIR = path.join(__dirname, '..', 'app', 'api');
const LOGGER_IMPORT = `const { logger } = await import('@/lib/logger');`;

// Mapping of console methods to logger methods
const methodMap = {
  'console.log': 'logger.debug',
  'console.info': 'logger.info',
  'console.warn': 'logger.warn',
  'console.error': 'logger.error',
};

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

  // Check if there are any console calls
  const hasConsoleCalls = /console\.(log|info|warn|error)/g.test(content);
  if (!hasConsoleCalls) {
    return false;
  }

  // Check if the logger is already imported
  hasImport = content.includes(LOGGER_IMPORT);

  // Replace console calls with logger calls
  Object.entries(methodMap).forEach(([consoleMethod, loggerMethod]) => {
    if (content.includes(consoleMethod)) {
      content = content.replace(new RegExp(consoleMethod, 'g'), loggerMethod);
      modified = true;
    }
  });

  // Add import if needed
  if (modified && !hasImport) {
    // Find the first try block (common pattern in API routes)
    const tryMatch = content.match(/try\s*{/);
    if (tryMatch) {
      const tryIndex = tryMatch.index + tryMatch[0].length;
      content =
        content.substring(0, tryIndex) +
        `\n    ${LOGGER_IMPORT}` +
        content.substring(tryIndex);
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
  console.log(`1. Add DEBUG_LOGS=1 to your .env.local file to see debug logs`);
  console.log(`2. Verify the changes and run your application`);
}

main().catch(console.error);
