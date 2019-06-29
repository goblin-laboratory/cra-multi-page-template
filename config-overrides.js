/* eslint-disable */
const {
  override,
  fixBabelImports,
  addLessLoader,
  // addBundleVisualizer ,
} = require('customize-cra');
const paths = require('react-scripts/config/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

paths.appIndexJs = `${paths.appSrc}/pages/index.js`;
// paths.appLoginJs = `${paths.appSrc}/pages/login.js`;
paths.servedPath = './';

const getEntryConfig = env => {
  const arr = 'development' === env ? [require.resolve('react-dev-utils/webpackHotDevClient')] : [];
  return entry => {
    return [...arr, `${paths.appSrc}/pages/${entry}.js`];
  };
};

const removePlugin = (plugins, name) => {
  const list = plugins.filter(it => !(it.constructor && it.constructor.name && name === it.constructor.name));
  if (list.length === plugins.length) {
    throw new Error(`Can not found plugin: ${name}.`);
  }
  return list;
};

const genHtmlWebpackPlugin = env => {
  const minify = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: {
      comments: '@cc_on',
    },
    minifyCSS: true,
    minifyURLs: true,
  };
  const config = Object.assign(
    {},
    { inject: true, template: paths.appHtml },
    'development' !== env ? { minify } : undefined,
  );
  return entry => {
    return new HtmlWebpackPlugin({
      ...config,
      chunks: ['vendors', `runtime~${entry}.html`, entry],
      filename: `${entry}.html`,
    });
  };
};

const supportMultiPage = (config, env) => {
  const list = ['index', 'login'];
  config.entry = {};
  config.plugins = removePlugin(config.plugins, 'HtmlWebpackPlugin');
  const getEntry = getEntryConfig(env);
  const getHtmlWebpackPlugin = genHtmlWebpackPlugin(env);
  list.forEach(it => {
    config.entry[it] = getEntry(it);
    config.plugins.push(getHtmlWebpackPlugin(it));
  });

  if ('development' === env) {
    config.output.filename = 'static/js/[name].bundle.js';
  } else {
    config.plugins = removePlugin(config.plugins, 'GenerateSW');
    const workboxWebpackPlugin = new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/, /\.html$/],
      importWorkboxFrom: 'local',
      // navigateFallback: paths.servedPath + '/index.html',
      // navigateFallbackBlacklist: [
      //   // Exclude URLs starting with /_, as they're likely an API call
      //   new RegExp('^/_'),
      //   // Exclude URLs containing a dot, as they're likely a resource in
      //   // public/ and not a SPA route
      //   new RegExp('/[^/]+\\.[^/]+$'),
      // ],
    });
    config.plugins.push(workboxWebpackPlugin);
  }
  return config;
};

module.exports = {
  webpack: override(
    supportMultiPage,
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    fixBabelImports('ant-design-pro', {
      libraryName: 'ant-design-pro',
      libraryDirectory: 'lib',
      style: true,
      camel2DashComponentName: false,
    }),
    addLessLoader({
      javascriptEnabled: true,
      localIdentName: '[local]--[hash:base64:5]',
      // modifyVars: { '@primary-color': '#1DA57A' },
    }),
    // addBundleVisualizer(),
  ),
  devServer: configFunction => {
    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);
      config.historyApiFallback.rewrites = [{ from: /^\/login\.html/, to: '/build/login.html' }];
      return config;
    };
  },
};
