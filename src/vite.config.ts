import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-import',
            {
              libraryName: '@mui/material',
              libraryDirectory: 'components',
              camel2DashComponentName: false,
            },
            '@mui/material',
          ],
          [
            'babel-plugin-import',
            {
              libraryName: '@mui/icons-material',
              libraryDirectory: 'esm',
              camel2DashComponentName: false,
            },
            '@mui/icons-material',
          ],
        ],
      },
    }),
  ],
});
