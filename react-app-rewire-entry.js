const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('react-scripts/config/paths');


const rewireEntry = (entrys) => {
  const entry = getEntryObject(entrys);

  return {
    rewireWebpackEntryConfig: (config, env) => {
      config = rewireEntryConfig(entry, config, env);
      config = rewireOutputConfig(config, env);
      config = rewireHtmlWebpackPlugin(entry, config, env);
      return config;
    },
    rewireDevServerkEntryConfig: (config) => {
      const rewrites = [];
      Object.keys(entry).map(name => {
        const reg = new RegExp(`^\\/${name}\\.html`);
        rewrites.push({ from: reg, to: `/${paths.appBuild}/${name}.html` });
        return name;
      });
      config.historyApiFallback.rewrites = rewrites;
      return config;
    },
  };
};

const getEntryObject = (entry) => {
  if (!(entry instanceof Array)) {
    return entry;
  }
  const obj = {};
  for (let i = 0, l = entry.length; i < l; i += 1) {
    const name = getNameByEntrySrc(entry[i]);
    obj[name] = entry[i];
  }
  return obj;
};

const getNameByEntrySrc = (entrySrc) => {
  const match = entrySrc.match(/^(.*[\/\\])?([^/.]+)\.[^.]+$/);
  if (match) {
    return match[2];
  } else {
    return 'index';
  }
};

const rewireEntryConfig = (entry, config, env) => {
  const entryDependences = [require.resolve('react-scripts/config/polyfills')];
  if ('development' !== env) {
    entryDependences.push(require.resolve('react-dev-utils/webpackHotDevClient'));
  }

  const entryConfig = {};
  Object.entries(entry).map(([name, entrySrc]) => {
    entryConfig[name] = [...entryDependences, entrySrc];
    return name;
  });
  config.entry = entryConfig;
  return config;
};

const rewireOutputConfig = (config, env) => {
  if ('development' === env) {
    config.output.filename = 'static/js/[name].bundle.js';
  }
  return config;
};

const rewireHtmlWebpackPlugin = (entry, config, env) => {
  config.plugins = removePlugin(config.plugins, (name) => /HtmlWebpackPlugin/i.test(name));

  Object.keys(entry).map(name => {
    const htmlPlugin = createHtmlWebpackPlugin(name, env);
    config.plugins.unshift(htmlPlugin);
    return name;
  });
  return config;
};

const removePlugin = (plugins, nameMatcher) => {
  return plugins.filter((it) => {
    return !(it.constructor && it.constructor.name && nameMatcher(it.constructor.name));
  });
};

const createHtmlWebpackPlugin = (entryName, env) => {
  const config = {
    inject: true,
    template: paths.appHtml,
    chunks: ['vendors', `runtime~${entryName}`, entryName],
    filename: `${entryName}.html`,
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

module.exports = rewireEntry;
