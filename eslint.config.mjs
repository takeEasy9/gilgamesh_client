// eslint.config.mjs
import antfu from '@antfu/eslint-config';

export default antfu({
  vue: {
    overrides: {
      'vue/block-order': ['error', {
        // .vue文件标签顺序
        order: ['template', 'script', 'style'],
      }],
    },
  },
  typescript: {
    tsconfigPath: 'tsconfig.json',
    overrides: {
      'ts/no-unsafe-assignment': 'warn',
      'ts/no-unsafe-member-access': 'warn',
      'ts/no-unsafe-argument': 'warn'
    },
  },
  jsonc: {
    overrides: {
      // 不对 json 文件中的 key 顺序做检查
      'sort-keys': 'off',
    },
  },
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
});
