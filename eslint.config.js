import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    files: ['src/**/*.{js,mjs,cjs}'],
    extends: [
      js.configs.recommended, // ← важно: НЕ 'js/recommended'
      prettier,
    ],
    languageOptions: { globals: globals.node },
  },
]);
