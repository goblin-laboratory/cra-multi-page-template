const paths = require('react-scripts/config/paths');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less-modules');
const rewireEntry = require('./react-app-rewire-entry');

// 多页配置：增加入口
console.log(paths.appIndexJs);
// paths.appIndexJs = paths.appSrc + '/index.js';
// console.log(paths.appIndexJs);
paths.appAdminJs = paths.appSrc + '/admin.js';
// 多页配置：build 生成的 js 与 css 文件依赖目录
paths.servedPath = './';

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
      // 多页配置： 指明哪些路径映射到哪个html
      // config = rewireDevServerkEntryConfig(config);
      // config.historyApiFallback.rewrites = [
      //   { from: /^\/admin.html/, to: '/build/admin.html' },
      // ];
      return rewireDevServerkEntryConfig(config);
    };
  },
};
