const path = require('path');

module.exports = function (api) {
  api.cache(true);
  
  // Monorepo: Point to workspace root for Babel plugin resolution
  const workspaceRoot = path.resolve(__dirname, '../..');
  
  return {
    presets: [
      // Resolve from workspace root for monorepo compatibility
      require.resolve('babel-preset-expo', { paths: [workspaceRoot] })
    ],
    plugins: [
      // Resolve from workspace root for monorepo compatibility
      require.resolve('@babel/plugin-transform-export-namespace-from', { paths: [workspaceRoot] }),
      [
        // Resolve Tamagui plugin from workspace root
        require.resolve('@tamagui/babel-plugin', { paths: [workspaceRoot] }),
        {
          components: ['tamagui'],
          config: path.join(__dirname, 'tamagui.config.ts'),
          logTimings: true,
        },
      ],
      // ✅ Reanimated plugin auto-included in babel-preset-expo (SDK 54+)
      // No need to manually add react-native-reanimated/plugin
    ],
  };
};

