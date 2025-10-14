const fs = require('fs');
const path = require('path');

console.log('Fixing node_modules/.package-lock.json...\n');

const lockPath = 'node_modules/.package-lock.json';
const data = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const packages = data.packages || {};

let fixed = 0;

Object.entries(packages).forEach(([key, val]) => {
  if (!val.version || val.version === '' || val.version === 'undefined') {
    // For workspace packages (@ybis/*), get version from their package.json
    if (key.startsWith('node_modules/@ybis/')) {
      const pkgName = key.replace('node_modules/@ybis/', '');
      let pkgPath = `packages/${pkgName}/package.json`;

      // Check if it's an app instead of package
      if (['backend', 'mobile', 'web'].includes(pkgName)) {
        pkgPath = `apps/${pkgName}/package.json`;
      }

      if (fs.existsSync(pkgPath)) {
        const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        packages[key].version = pkgData.version || '0.1.0';
        console.log(`✓ Fixed ${key}: ${packages[key].version}`);
        fixed++;
      }
    }
    // For nested packages, try to find their package.json
    else if (key.includes('node_modules/')) {
      const parts = key.split('node_modules/');
      const pkgName = parts[parts.length - 1];
      const possiblePath = key.replace(/^apps\/[^/]+\//, '') + '/package.json';

      if (fs.existsSync(possiblePath)) {
        const pkgData = JSON.parse(fs.readFileSync(possiblePath, 'utf8'));
        packages[key].version = pkgData.version || '0.0.0';
        console.log(`✓ Fixed ${key}: ${packages[key].version}`);
        fixed++;
      } else {
        // Default fallback
        packages[key].version = '0.0.0';
        console.log(`⚠ Fixed ${key}: 0.0.0 (fallback)`);
        fixed++;
      }
    }
  }
});

if (fixed > 0) {
  fs.writeFileSync(lockPath, JSON.stringify(data, null, 2));
  console.log(`\n✓ Fixed ${fixed} packages and saved ${lockPath}`);
} else {
  console.log('\n✓ No packages needed fixing');
}
