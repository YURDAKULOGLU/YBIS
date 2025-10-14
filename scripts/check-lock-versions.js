#!/usr/bin/env node
/**
 * Check for invalid/empty versions in lock files
 * Usage: node scripts/check-lock-versions.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking lock files for invalid versions...\n');

// Check package-lock.json (npm)
const npmLockPath = path.join(process.cwd(), 'package-lock.json');
if (fs.existsSync(npmLockPath)) {
  console.log('📦 Checking package-lock.json...');
  try {
    const lockData = JSON.parse(fs.readFileSync(npmLockPath, 'utf8'));
    const issues = [];
    
    function checkNode(node, path = '') {
      if (node.version === '' || node.version === undefined || node.version === null) {
        issues.push({
          path,
          name: node.name || 'unknown',
          version: node.version,
        });
      }
      
      if (node.dependencies) {
        Object.entries(node.dependencies).forEach(([name, dep]) => {
          checkNode(dep, `${path}/${name}`);
        });
      }
      
      if (node.packages) {
        Object.entries(node.packages).forEach(([pkgPath, pkg]) => {
          checkNode(pkg, pkgPath);
        });
      }
    }
    
    checkNode(lockData);
    
    if (issues.length > 0) {
      console.log(`❌ Found ${issues.length} packages with invalid versions:\n`);
      issues.forEach(issue => {
        console.log(`  - ${issue.name} at ${issue.path}`);
        console.log(`    Version: "${issue.version}"`);
      });
      console.log('\n💡 Solution: Delete package-lock.json and run npm install again\n');
    } else {
      console.log('✅ No invalid versions found in package-lock.json\n');
    }
  } catch (error) {
    console.log(`⚠️  Error reading package-lock.json: ${error.message}\n`);
  }
} else {
  console.log('ℹ️  No package-lock.json found (using pnpm?)\n');
}

// Check pnpm-lock.yaml
const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml');
if (fs.existsSync(pnpmLockPath)) {
  console.log('📦 Checking pnpm-lock.yaml...');
  try {
    const lockContent = fs.readFileSync(pnpmLockPath, 'utf8');
    const emptyVersions = [];
    const lines = lockContent.split('\n');
    
    lines.forEach((line, index) => {
      // Check for empty version patterns
      if (line.match(/version:\s*$/)) {
        emptyVersions.push({
          line: index + 1,
          content: line.trim(),
        });
      }
      if (line.match(/version:\s*['"]\s*['"]$/)) {
        emptyVersions.push({
          line: index + 1,
          content: line.trim(),
        });
      }
    });
    
    if (emptyVersions.length > 0) {
      console.log(`❌ Found ${emptyVersions.length} empty versions:\n`);
      emptyVersions.forEach(issue => {
        console.log(`  Line ${issue.line}: ${issue.content}`);
      });
      console.log('\n💡 Solution: Delete pnpm-lock.yaml and run pnpm install again\n');
    } else {
      console.log('✅ No empty versions found in pnpm-lock.yaml\n');
    }
  } catch (error) {
    console.log(`⚠️  Error reading pnpm-lock.yaml: ${error.message}\n`);
  }
}

// Check all package.json files
console.log('📦 Checking package.json files...');
const packageJsonFiles = [
  'package.json',
  'apps/mobile/package.json',
  'apps/backend/package.json',
  'apps/web/package.json',
  ...fs.readdirSync('packages')
    .filter(name => fs.existsSync(path.join('packages', name, 'package.json')))
    .map(name => `packages/${name}/package.json`),
];

const packageIssues = [];
packageJsonFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  try {
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check version field
    if (!pkg.version || pkg.version === '') {
      packageIssues.push({
        file: filePath,
        issue: 'Missing or empty version field',
        version: pkg.version,
      });
    }
    
    // Check dependencies for invalid versions
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (pkg[depType]) {
        Object.entries(pkg[depType]).forEach(([name, version]) => {
          if (version === '' || version === null || version === undefined) {
            packageIssues.push({
              file: filePath,
              issue: `Empty version for ${name} in ${depType}`,
              dependency: name,
              version,
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(`⚠️  Error reading ${filePath}: ${error.message}`);
  }
});

if (packageIssues.length > 0) {
  console.log(`❌ Found ${packageIssues.length} issues in package.json files:\n`);
  packageIssues.forEach(issue => {
    console.log(`  ${issue.file}:`);
    console.log(`    ${issue.issue}`);
    if (issue.dependency) {
      console.log(`    Dependency: ${issue.dependency}`);
    }
    console.log(`    Version: "${issue.version}"`);
    console.log('');
  });
} else {
  console.log('✅ All package.json files look good\n');
}

console.log('✅ Check complete!');

