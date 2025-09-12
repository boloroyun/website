/**
 * Helper script to restore navigation functionality while keeping logs minimal
 * Run this if you've applied the silence-all-logs.js script and are having issues
 *
 * Usage:
 * node scripts/fix-navigation.js
 */

const fs = require('fs');
const path = require('path');

// Config
const ROOT_DIR = path.join(__dirname, '..');
const ENV_FILE_PATH = path.join(ROOT_DIR, '.env.local');

// Helper to recursively find files
function findFiles(dir, filelist = []) {
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

  return filelist;
}

// Remove any code that directly modifies console object
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if file has any console overrides
    if (
      content.includes('console.log = ') ||
      content.includes('console.info = ') ||
      content.includes('console.debug = ')
    ) {
      // Remove any lines that override console methods
      const lines = content.split('\n');
      const fixedLines = lines.filter((line) => {
        return (
          !line.includes('console.log = ') &&
          !line.includes('console.info = ') &&
          !line.includes('console.debug = ') &&
          !line.includes('console.warn = ') &&
          !line.includes('console.error = ') &&
          !line.includes('const originalLog = console.log')
        );
      });

      content = fixedLines.join('\n');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Create or update .env.local file
function setupEnvFile() {
  try {
    let content = '';
    if (fs.existsSync(ENV_FILE_PATH)) {
      content = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    }

    if (content.includes('DEBUG_LOGS=')) {
      // Update existing value
      content = content.replace(
        /DEBUG_LOGS=\d/,
        'DEBUG_LOGS=0' // Keep logs quiet but don't break functionality
      );
    } else {
      // Add the value
      content += '\n# Debug settings (0=quiet, 1=show logs)\nDEBUG_LOGS=0\n';
    }

    fs.writeFileSync(ENV_FILE_PATH, content.trim() + '\n', 'utf8');
    return true;
  } catch (error) {
    console.error('Error setting up .env.local file:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🔄 Fixing navigation issues...');

  // Fix .env.local file
  const envFixed = setupEnvFile();
  if (envFixed) {
    console.log('✅ Updated .env.local file');
  }

  // Fix files with console overrides
  console.log('🔍 Finding files to fix...');
  const targetDirs = [
    path.join(ROOT_DIR, 'app'),
    path.join(ROOT_DIR, 'lib'),
    path.join(ROOT_DIR, 'components'),
    path.join(ROOT_DIR, 'middleware.ts'),
  ];

  let allFiles = [];
  for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
      if (fs.statSync(dir).isDirectory()) {
        const files = findFiles(dir);
        allFiles = [...allFiles, ...files];
      } else {
        allFiles.push(dir);
      }
    }
  }

  console.log(`📂 Found ${allFiles.length} files to check`);

  let fixedCount = 0;
  for (const file of allFiles) {
    try {
      const wasFixed = fixFile(file);
      if (wasFixed) {
        fixedCount++;
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
      }
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error);
    }
  }

  console.log(`\n🎉 Done! Fixed ${fixedCount} files.`);
  console.log(`\nNext steps:`);
  console.log(`1. Restart your development server`);
  console.log(`2. Navigation should work now with minimal console output`);
}

main().catch(console.error);
