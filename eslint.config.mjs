import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default [
  // 指定检查的文件类型
  { files: ["**/*.{js,mjs,cjs,ts}"] },

  // 配置全局变量环境 (Node.js)
  { languageOptions: { globals: globals.node } },

  // 引入推荐配置
  pluginJs.configs.recommended, // JS 推荐配置
  ...tseslint.configs.recommended, // TS 推荐配置

  // 关闭与 Prettier 冲突的 ESLint 规则
  prettierConfig,

  // 自定义规则
  {
    rules: {
      // 允许使用 any (前期开发方便，后期建议关掉)
      "@typescript-eslint/no-explicit-any": "off",
      
      // 这里的规则可以覆盖上面的推荐配置
      "no-console": "off", 
      "@typescript-eslint/no-unused-vars": "warn"
    },
  },
  
  // 忽略文件夹 (替代 .eslintignore)
  {
    ignores: ["dist/*", "node_modules/*"],
  }
];