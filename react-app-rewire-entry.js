const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('react-scripts/config/paths');

/**
 * TODO: 四种方式
 * 1. 数组方式 ['src/index.js', 'src\admin.js']
 * 2. 对象形式 { index: 'src/index.js', admin: 'src\admin.js' }
 * 3. 匹配目录下的文件 'src/pages/*.js'
 * 4. 匹配目录 'src\pages\*\index.js'
 */
const rewireEntry = (entrys) => {
  // TODO: 将四种格式的 entry 格式化成对象形式
  const removePlugin = (plugins, nameMatcher) => {
    return plugins.filter((it) => {
      return !(it.constructor && it.constructor.name && nameMatcher(it.constructor.name));
    });
  };

  const createHtmlWebpackPlugin = (entry, env) => {
    const config = {
      inject: true,
      template: paths.appHtml,
      // 多页配置：2.x 版本默认开启 optimization ，chunks 中需要增加 'vendors', 'runtime~admin'
      chunks: ['vendors', `runtime~${entry}`, entry],
      filename: `${entry}.html`,
    };
    if ('development' === env) {
      return new HtmlWebpackPlugin(config);
    } else {
      return new HtmlWebpackPlugin({
        ...config,
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
      });
    }
  };

  const getKeyByEntrySrc = (entrySrc) => {
    const match = entrySrc.match(/^(.*[\/\\])?([^/.]+)\.[^.]+$/);
    if (match) {
      return match[2];
    } else {
      return 'index';
    }
  };

  const rewireEntryConfig = (config, env) => {
    const entryDependences = [require.resolve('react-scripts/config/polyfills')];
    if ('development' !== env) {
      entryDependences.push(require.resolve('react-dev-utils/webpackHotDevClient'));
    }

    const entryConfig = {};
    for (let i = 0, l = entrys.length; i < l; i += 1) {
      const key = getKeyByEntrySrc(entrys[i]);
      entryConfig[key] = [...entryDependences, entrys[i]];
    }
    config.entry = entryConfig;
    return config;
  };

  const rewireOutputConfig = (config, env) => {
    if ('development' === env) {
      config.output.filename = 'static/js/[name].bundle.js';
    }
    return config;
  };

  const rewireHtmlWebpackPlugin = (config, env) => {
    config.plugins = removePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name));

    // const newPlugins = [];
    for (let i = entrys.length - 1; 0 <= i; i -= 1) {
      const key = getKeyByEntrySrc(entrys[i]);
      const htmlPlugin = createHtmlWebpackPlugin(key, env);
      config.plugins.unshift(htmlPlugin);
    }
    // config.plugins = replacePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name), newPlugins);
    return config;
  };

  return {
    rewireWebpackEntryConfig: (config, env) => {
      config = rewireEntryConfig(config, env);
      config = rewireOutputConfig(config, env);
      config = rewireHtmlWebpackPlugin(config, env);
      return config;
    },
    rewireDevServerkEntryConfig: (config) => {
      const rewrites = [];
      for (let i = 0, l = entrys.length; i < l; i += 1) {
        const key = getKeyByEntrySrc(entrys[i]);
        const reg = new RegExp(`^\\/${key}\\.html`);
        rewrites.push({ from: reg, to: `/${paths.appBuild}/${key}.html` });
      }
      return config;
    },
  };
};

module.exports = rewireEntry;
