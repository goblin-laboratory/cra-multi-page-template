## 初始化

### 创建项目

```sh
npx create-react-app .
```

### 安装 `react-app-rewired` 和 `customize-cra`

```sh
yarn add react-app-rewired customize-cra --dev
```

### 增加 config-overrides.js 文件

```js
// config-overrides.js
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
```

### 修改 package.json `scripts`

```json
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

```json
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
```

## 支持多页面

```js

```

## 其他项


### 支持 IE11
