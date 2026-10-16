import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([ 
  //ignora los build del front 
  {
    ignores:[
      "dist/**",
      "node_modules/**"
    ]
  },
  { files: ["server/**/*.{js,mjs,cjs}"], 
    plugins: { js }, extends: ["js/recommended"], 
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.browser} } },
]);
