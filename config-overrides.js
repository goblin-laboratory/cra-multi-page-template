const paths = require('react-scripts/config/paths');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less-modules');
// const rewireEntry = require('./react-app-rewire-entry');
const rewireEntry = require('react-app-rewire-entry');

paths.appAdminJs = paths.appSrc + '/admin.js';
paths.servedPath = './';

// 多页面: 初始化 react-app-rewire-entry
const {
  rewireWebpackEntryConfig,
  rewireDevServerkEntryConfig,
} = rewireEntry([paths.appIndexJs, paths.appAdminJs]);

module.exports = {
  webpack: (config, env) => {
    // antd 按需加载
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    // 支持 less 变量重写与 less module
    config = rewireLess.withLoaderOptions({
      javascriptEnabled: true,
      // 修改 less 变量
      // modifyVars: { "@primary-color": "#1DA57A" },
    })(config, env);
    // 多页面: 修改 webpack 打包配置
    config = rewireWebpackEntryConfig(config, env);
    // 统计分析
    // if ('development' !== env) {
    //   config.plugins.push(
    //     new BundleAnalyzerPlugin({ generateStatsFile: true })
    //   );
    // }
    return config;
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      // 多页配置： 修改 devServer 映射关系
      return rewireDevServerkEntryConfig(config);
    };
  },
};
