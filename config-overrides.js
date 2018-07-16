const paths = require('react-scripts/config/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less-modules');

paths.appAdminJs = paths.appSrc + '/admin.js';
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
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
      javascriptEnabled: true,
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
      config.output.filename = 'static/js/[name].bundle.js';

      const indexHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        chunks: ['vendors', 'runtime~index', 'index'],
        filename: 'index.html',
      });
      const adminHtmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        chunks: ['vendors', 'runtime~admin', 'admin'],
        filename: 'admin.html',
      });
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
      config.plugins = replacePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name), indexHtmlPlugin);
      config.plugins.push(adminHtmlPlugin);
    }
    return config;
  },
  devServer: (configFunction) => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      config.historyApiFallback.rewrites = [
        { from: /^\/admin.html/, to: '/build/admin.html' },
      ];
      return config;
    };
  },
};
