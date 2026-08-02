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
  // tsup injects deprecated `baseUrl` during DTS; silence until upstream fix (egoist/tsup#1388)
  dts: {
    compilerOptions: {
      ignoreDeprecations: "6.0",
    },
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  external: ['react', 'react-dom', 'leaflet', 'react-leaflet'],
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
