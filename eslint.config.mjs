import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Disable or adjust specific rules
      'prefer-const': 'off', // Disable the 'prefer-const' rule
      '@typescript-eslint/no-unused-vars': 'warn', // Warn instead of error for unused variables
      '@typescript-eslint/no-explicit-any': 'off', // Allow the use of `any`
      'react/no-unescaped-entities': 'off', // Disable escaping entities in JSX
    },
  },
];

export default eslintConfig;
