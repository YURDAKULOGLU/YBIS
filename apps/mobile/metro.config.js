const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Root of monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// #1: Watch all files in monorepo
config.watchFolders = [workspaceRoot];

// #2: Force Metro to resolve (sub)dependencies from `nodeModulesPaths`
// pnpm support: also check .pnpm virtual store
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules/.pnpm'),
];

// #3: Support monorepo packages (@ybis/*)
config.resolver.disableHierarchicalLookup = false;

// #4: Support for Tamagui
config.resolver.sourceExts.push('mjs');

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// #5: Optimize build performance
config.transformer.minifierPath = 'metro-minify-terser';
config.transformer.minifierConfig = {
  compress: {
    drop_console: false, // Keep console.log in dev
  },
};

module.exports = config;


