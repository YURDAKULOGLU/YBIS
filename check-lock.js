const fs = require('fs');
const data = JSON.parse(fs.readFileSync('node_modules/.package-lock.json', 'utf8'));
const packages = data.packages || {};

console.log('Checking for packages with empty/missing version...\n');

const problematic = Object.entries(packages).filter(([key, val]) => {
  return !val.version || val.version === '' || val.version === undefined;
});

if (problematic.length === 0) {
  console.log('✓ All packages have valid versions');
} else {
  console.log(`✗ Found ${problematic.length} packages with empty/missing version:\n`);
  problematic.forEach(([key, val]) => {
    console.log(`  ${key}`);
    console.log(`    version: "${val.version}"`);
  });
}
