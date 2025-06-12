const { whenDev } = require('@craco/craco');

module.exports = {
  // Only necessary if you want overlays changed in the dev server
  devServer: (devServerConfig) => {
    // Webpack5, react-scripts 5: overlay only for errors, not warnings
    if (devServerConfig.overlay) {
      devServerConfig.overlay.errors = true;
      devServerConfig.overlay.warnings = false;
    }
    return devServerConfig;
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Only errors show in overlay, warnings only in console
      if (webpackConfig.devServer && webpackConfig.devServer.overlay) {
        webpackConfig.devServer.overlay.errors = true;
        webpackConfig.devServer.overlay.warnings = false;
      }
      return webpackConfig;
    },
  },
};
