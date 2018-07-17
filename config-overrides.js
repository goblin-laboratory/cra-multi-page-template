const paths = require('react-scripts/config/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less-modules');

// 多页配置：增加入口
paths.appAdminJs = paths.appSrc + '/admin.js';
// 多页配置：build 生成的 js 与 css 文件依赖目录
paths.servedPath = './';

const replacePlugin = (plugins, nameMatcher, newPlugin) => {
  const pluginIndex = plugins.findIndex((plugin) => {
    return plugin.constructor && plugin.constructor.name && nameMatcher(plugin.constructor.name);
  });

  if (-1 === pluginIndex) {
    return plugins;
  }

  const nextPlugins = plugins.slice(0, pluginIndex).concat(newPlugin).concat(plugins.slice(pluginIndex + 1));

  return nextPlugins;
};

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

    if ('development' === env) {
      config.entry = {
        index: [
          require.resolve('react-scripts/config/polyfills'),
          require.resolve('react-dev-utils/webpackHotDevClient'),
          paths.appIndexJs,
        ],
        admin: [
          require.resolve('react-scripts/config/polyfills'),
          require.resolve('react-dev-utils/webpackHotDevClient'),
          paths.appAdminJs,
        ]
      };
      // 多页配置：区分开入口文件
      config.output.filename = 'static/js/[name].bundle.js';

      const indexHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        // 多页配置：2.x 版本默认开启 optimization ，chunks 中需要增加 'vendors', 'runtime~admin'
        chunks: ['vendors', 'runtime~index', 'index'],
        filename: 'index.html',
      });
      const adminHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        chunks: ['vendors', 'runtime~admin', 'admin'],
        filename: 'admin.html',
      });
      // 多页配置：
      config.plugins = replacePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name), indexHtmlPlugin);
      config.plugins.push(adminHtmlPlugin);
    } else {
      config.entry = {
        index: [require.resolve('react-scripts/config/polyfills'), paths.appIndexJs],
        admin: [require.resolve('react-scripts/config/polyfills'), paths.appAdminJs],
      };
      const indexHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        chunks: ['vendors', 'runtime~index', 'index'],
        filename: 'index.html',
      });
      const adminHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        chunks: ['vendors', 'runtime~admin', 'admin'],
        filename: 'admin.html',
      });
      // 多页配置：替换 index.html 生成规则
      config.plugins = replacePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name), indexHtmlPlugin);
      // 多页配置：添加 plugin 生成 admin.html
      config.plugins.push(adminHtmlPlugin);
      // 统计分析
      config.plugins.push(
        new BundleAnalyzerPlugin({generateStatsFile: true})
      );
    }
    return config;
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      // 多页配置： 指明哪些路径映射到哪个html
      config.historyApiFallback.rewrites = [
        { from: /^\/admin.html/, to: '/build/admin.html' },
      ];
      return config;
    };
  },
};
