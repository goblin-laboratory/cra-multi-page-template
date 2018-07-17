module.exports = {
  extends: [
    'eslint-config-alloy/react',
  ],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    //
    // React: false,
    // ReactDOM: false
  },
  rules: {
    // 这里填入你的项目需要的个性化配置，比如：
    //
    // @fixable 一个缩进必须用两个空格替代
    'indent': ['error', 2, { SwitchCase: 1, flatTernaryExpressions: true }],
    // @fixable jsx 的 children 缩进必须为两个空格
    'react/jsx-indent': ['error', 2],
    // @fixable jsx 的 props 缩进必须为两个空格
    'react/jsx-indent-props': ['error', 2],
    'yoda': [2, 'always'],
    'no-undefined': 0,
    // 数组中的 jsx 必须有 key
    'react/jsx-key': 0,
    'object-curly-spacing': 0,
    'generator-star-spacing': 0,
    'no-debugger': 1,
    'prefer-promise-reject-errors': 0,
    'no-undef': [0, {
      "$": false,
      "window": false
    }],
  }
};
