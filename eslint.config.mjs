// eslint.config.mjs
import antfu from "@antfu/eslint-config";

export default antfu({
  vue: true,
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
});
