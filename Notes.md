# create-react-app 多页应用配置模板

## 初始化

### 创建项目

使用 `create-react-app` 创建项目

```sh
npx create-react-app .
```

> create-react-app: https://facebook.github.io/create-react-app/docs/getting-started

### `react-app-rewired` 初始化

- 安装 `react-app-rewired` 和 `customize-cra`

```sh
yarn add react-app-rewired customize-cra --dev
```

- 增加 `config-overrides.js` 文件

```js
// config-overrides.js
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
```

- 修改 package.json `scripts`

```diff
/* package.json */
    "scripts": {
-     "start": "react-scripts start",
+     "start": "react-app-rewired start",
-     "build": "react-scripts build",
+     "build": "react-app-rewired build",
-     "test": "react-scripts test",
+     "test": "react-app-rewired test",
      "eject": "react-scripts eject"
    },
```

> react-app-rewired: https://github.com/timarney/react-app-rewired

## `ant-design` 按需加载

根据 `ant-design` 文档修改 `config-overrides.js`

```diff
/* config-overrides.js */
+ const { override, fixBabelImports, addLessLoader } = require('customize-cra');

- module.exports = function override(config, env) {
-   // do stuff with the webpack config...
-   return config;
- };
+ module.exports = {
+   webpack: override(
+     fixBabelImports('import', {
+       libraryName: 'antd',
+       libraryDirectory: 'es',
+       style: true,
+     }),
+     fixBabelImports('ant-design-pro', {
+       libraryName: 'ant-design-pro',
+       libraryDirectory: 'lib',
+       style: true,
+       camel2DashComponentName: false,
+     }),
+     addLessLoader({
+       javascriptEnabled: true,
+       localIdentName: '[local]--[hash:base64:5]',
+       // modifyVars: { '@primary-color': '#1DA57A' },
+     }),
+   ),
+ };
```

> 参考文档: https://ant.design/docs/react/use-with-create-react-app-cn#%E4%BD%BF%E7%94%A8-babel-plugin-import

## 支持多页面

### 修改入口文件

1. 删除默认的 `src/index.js` 入口文件和相关依赖
2. 创建 `src/pages/` 目录
3. 创建 `src/pages/index.js` 和 `src/pages/login.js`
4. 参考 [`dva` 快速开始指南](https://dvajs.com/guide/getting-started.html)编写 `src/pages/index.js` 和 `src/pages/login.js` 已经相关依赖的代码
5. 多页应用应该使用 hashHistory，注意修改

### 自定义 `create-react-app` 配置

```diff
/* config-overrides.js */
+ const supportMultiPage = (config, env) => {
+   // do stuff with the webpack config...
+   return config;
+ };

  module.exports = {
    webpack: override(
+     supportMultiPage,
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      }),
      ...
    ),
  },
```

### 修改默认入口文件和根目录

```diff
/* config-overrides.js */
  const {
    override,
    fixBabelImports,
    addLessLoader,
  } = require('customize-cra');
+ const paths = require('react-scripts/config/paths');

+ paths.appIndexJs = `${paths.appSrc}/pages/index.js`;
+ paths.servedPath = './';

...

```

### 修改 `HtmlWebpackPlugin` 配置

```diff
/* config-overrides.js */
...
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

...

+ const getEntryConfig = env => {
+   const arr = 'development' === env ? [require.resolve('react-dev-utils/webpackHotDevClient')] : [];
+   return entry => {
+     return [...arr, `${paths.appSrc}/pages/${entry}.js`];
+   };
+ };
+
+ const removePlugin = (plugins, name) => {
+   const list = plugins.filter(it => !(it.constructor && it.constructor.name && name === it.constructor.name));
+   if (list.length === plugins.length) {
+     throw new Error(`Can not found plugin: ${name}.`);
+   }
+   return list;
+ };
+
+ const genHtmlWebpackPlugin = env => {
+   const minify = {
+     removeComments: true,
+     collapseWhitespace: true,
+     removeRedundantAttributes: true,
+     useShortDoctype: true,
+     removeEmptyAttributes: true,
+     removeStyleLinkTypeAttributes: true,
+     keepClosingSlash: true,
+     minifyJS: true,
+     minifyCSS: true,
+     minifyURLs: true,
+   };
+   const config = Object.assign(
+     {},
+     { inject: true, template: paths.appHtml },
+     'development' !== env ? { minify } : undefined,
+   );
+   return entry => {
+     return new HtmlWebpackPlugin({
+       ...config,
+       chunks: ['vendors', `runtime~${entry}.html`, entry],
+       filename: `${entry}.html`,
+     });
+   };
+ };
+
+ const supportMultiPage = (config, env) => {
+   const list = ['index', 'login'];
+   config.entry = {};
+   config.plugins = removePlugin(config.plugins, 'HtmlWebpackPlugin');
+   const getEntry = getEntryConfig(env);
+   const getHtmlWebpackPlugin = genHtmlWebpackPlugin(env);
+   list.forEach(it => {
+     config.entry[it] = getEntry(it);
+     config.plugins.push(getHtmlWebpackPlugin(it));
+   });
+
+   if ('development' === env) {
+     config.output.filename = 'static/js/[name].bundle.js';
+   }
+   return config;
+ };
...
```

### 修改 devServer，开发环境支持多页面

```diff
/* config-overrides.js */
  ...
  module.exports = {
    webpack: override(
      ...
    ),
+   devServer: configFunction => {
+     return (proxy, allowedHost) => {
+       const config = configFunction(proxy, allowedHost);
+       config.historyApiFallback.rewrites = [{ from: /^\/login\.html/, to: '/build/login.html' }];
+       return config;
+     };
+   },
  };
```

## 开启 PWA

### 修改 `create-react-app` 默认 `GenerateSW` 配置

```diff
/* config-overrides.js */
  ...
+ const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
  ...
  const supportMultiPage = (config, env) => {
    ...
    if ('development' === env) {
      config.output.filename = 'static/js/[name].bundle.js';
    } else {
+     config.plugins = removePlugin(config.plugins, 'GenerateSW');
+     const workboxWebpackPlugin = new WorkboxWebpackPlugin.GenerateSW({
+       clientsClaim: true,
+       exclude: [/\.map$/, /asset-manifest\.json$/, /\.html$/],
+       importWorkboxFrom: 'local',
+       // navigateFallback: paths.servedPath + '/index.html',
+       // navigateFallbackBlacklist: [
+       //   // Exclude URLs starting with /_, as they're likely an API call
+       //   new RegExp('^/_'),
+       //   // Exclude URLs containing a dot, as they're likely a resource in
+       //   // public/ and not a SPA route
+       //   new RegExp('/[^/]+\\.[^/]+$'),
+       // ],
+     });
+     config.plugins.push(workboxWebpackPlugin);
+   }
    return config;
  };
...

```

### 页面入口文件中注册 serviceWorker

```diff
/* src/pages/index.js 和 src/pages/login.js 中同时修改 */
+ import * as serviceWorker from '../serviceWorker';
  ...
+ serviceWorker.register();
```

## 兼容 IE11

### 增加 `react-app-polyfill` 依赖

```sh
yarn add react-app-polyfill
```

### 页面入口文件开始位置 `import`

```diff
/* src/pages/index.js 和 src/pages/login.js 中同时修改 */
+ import 'react-app-polyfill/ie11';
+ import 'react-app-polyfill/stable';
```

### 开发环境支持

```diff
/* package.json */
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
-       "last 1 safari version",
+       "last 1 safari version",
+       "last 1 ie version"
      ]
    },
```

### 低版本浏览器升级提醒
1. 修改 index.html 文件
```diff
+ <script>/*@cc_on window.location.href="http://support.dmeng.net/upgrade-your-browser.html?referrer="+encodeURIComponent(window.location.href); @*/</script>
  <title>React App</title>
```

2. 修改 minifyJS 参数
```diff
  const genHtmlWebpackPlugin = env => {
    const minify = {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
-     minifyJS: true,
+     minifyJS: {
+       comments: '@cc_on',
+     },
      minifyCSS: true,
      minifyURLs: true,
    };
    ...
  };
```
