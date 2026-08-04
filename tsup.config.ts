import { copyFileSync, mkdirSync, unlinkSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    map: 'src/map.ts',
  },
  format: ['esm', 'cjs'],
  // Declarations via `tsc -p tsconfig.build.json` — tsup/rollup-plugin-dts lacks TS 7 API support
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  external: [
    'react',
    'react-dom',
    'leaflet',
    'react-leaflet',
    '@base-ui/react',
    '@base-ui/react/drawer',
  ],
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  async onSuccess() {
    const distDir = resolve(rootDir, 'dist');
    mkdirSync(distDir, { recursive: true });

    // Prefer bundled CSS (tokens + components); fall back to source tokens file.
    const bundledCss = resolve(distDir, 'index.css');
    const stylesOut = resolve(distDir, 'styles.css');
    try {
      copyFileSync(bundledCss, stylesOut);
    } catch {
      copyFileSync(resolve(rootDir, 'src/styles.css'), stylesOut);
    }

    for (const name of readdirSync(distDir)) {
      if (name.startsWith('metafile-')) {
        unlinkSync(join(distDir, name));
      }
    }
  },
});
