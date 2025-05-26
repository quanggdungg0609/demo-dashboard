import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Tắt rule unused-vars
      "@typescript-eslint/no-explicit-any": "off", // Nếu muốn tắt luôn rule cấm dùng any
      "react-hooks/exhaustive-deps": "warn", // hoặc "off" nếu muốn tắt cảnh báo useEffect
    },
  },
];

export default eslintConfig;
