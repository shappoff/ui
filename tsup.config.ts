import { copyFileSync, mkdirSync, unlinkSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  external: ['react', 'react-dom'],
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
