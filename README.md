# `@shappoff/ui`

Приватный npm-пакет с переиспользуемыми React-компонентами для внутренних проектов. Публикуется в **GitHub Packages** (`npm.pkg.github.com`), scope **`@shappoff`**.

Совместим с **React 18+** и **Next.js** (App Router): интерактивные компоненты помечены `"use client"`.

Токены и переменные (`NODE_AUTH_TOKEN`, PAT, secrets) — см. документацию ниже, не храните секреты в git.

## Быстрый старт (потребитель)

```bash
# 1. .npmrc в проекте:
# @shappoff:registry=https://npm.pkg.github.com
#
# 2. Auth: PAT в ~/.npmrc или NODE_AUTH_TOKEN (см. docs/CONSUMER_SETUP.md)

npm install @shappoff/ui
```

```tsx
import { Button, Input, Badge, Drawer } from "@shappoff/ui";
import "@shappoff/ui/styles.css";
```

Next.js: добавьте `transpilePackages: ["@shappoff/ui"]` в конфиг.

**Vercel:** в проекте `.npmrc` с `${NODE_AUTH_TOKEN}` + Environment Variable `NODE_AUTH_TOKEN` (PAT) — см. [CONSUMER_SETUP.md → Часть C](./docs/CONSUMER_SETUP.md#часть-c-vercel-проект-потребитель).

## Компоненты

| Компонент / entry | Назначение |
|-------------------|------------|
| `Button` | Кнопка: `variant`, `size`, `forwardRef` |
| `Input` | Поле ввода: `label`, `error`, `forwardRef` |
| `Badge` | Метка: `tone` (`neutral` \| `success` \| `warning`) |
| `Drawer` | Панель с края экрана (Base UI): trigger / content / snap points |
| `@shappoff/ui/map` → `LeafletMap` | Оболочка карты (basemap switcher, `children` overlays) |
| `@shappoff/ui/map` → `MapMarkerLayer` | Слой маркеров (`markers`, `variant`) |
| `@shappoff/ui/map` → `MapSkeleton` | Placeholder при lazy-load |

Для `Drawer` установите peer `@base-ui/react`:

```bash
npm install @base-ui/react
```

```tsx
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@shappoff/ui";

export function ExampleDrawer() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Open
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Supporting text</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="secondary" />}>
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

Главный entry (`@shappoff/ui`) **не** реэкспортирует карту — Leaflet остаётся optional peer.

### Карта (`@shappoff/ui/map`)

Peers (optional для UI без карты; обязательны для map entry):

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

```tsx
import {
  LeafletMap,
  MapMarkerLayer,
  MapSkeleton,
  type MapMarker,
} from "@shappoff/ui/map";
import "@shappoff/ui/styles.css";
import "leaflet/dist/leaflet.css";

const markers: MapMarker[] = [
  { id: "1", lat: 53.9, lng: 27.56, title: "Минск" },
];

export function ExampleMap() {
  return (
    <LeafletMap ariaLabel="Карта">
      <MapMarkerLayer markers={markers} variant="primary" />
    </LeafletMap>
  );
}
```

**Next.js (SSG / App Router):** грузите карту через `next/dynamic` с `ssr: false` (Leaflet требует `window`). Пример — в [CONSUMER_SETUP.md](./docs/CONSUMER_SETUP.md#карта-shappoffuimap).

## Структура проекта

```text
npm/
├── .cursor/rules/             # Storybook / component conventions for AI
├── .github/workflows/
│   ├── ci.yml                 # typecheck + build
│   ├── deploy-storybook.yml   # GitHub Pages (Storybook)
│   └── publish.yml            # publish в GitHub Packages (release / tag v*)
├── .storybook/                # Storybook 10 (react-vite)
├── docs/
│   ├── GITHUB_SETUP.md        # GitHub, PAT, NODE_AUTH_TOKEN, публикация
│   └── CONSUMER_SETUP.md      # установка локально, в CI и на Vercel
├── src/
│   ├── index.ts               # публичный API (Button, Input, Badge)
│   ├── map.ts                 # публичный API карты (@shappoff/ui/map)
│   ├── styles.css             # CSS-переменные и стили компонентов
│   ├── maps/                  # типы, tile layers, BELARUS_VIEW
│   └── components/            # + colocated *.stories.tsx
├── .npmrc                     # mapping @shappoff → GitHub Packages (без токена)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts           # Storybook Vitest addon
├── LICENSE
└── README.md
```

После `npm run build` в `dist/` попадают ESM, CJS, типы и `styles.css`. В npm-пакет входит только `dist/` (`files` в `package.json`).

## Storybook

Живой каталог компонентов (CSF3, autodocs, a11y):

```bash
npm run storybook          # http://localhost:6006
npm run build-storybook    # static → storybook-static/
```

Публичный деплой: **GitHub Pages** → [https://shappoff.github.io/ui/](https://shappoff.github.io/ui/)  
Workflow: `.github/workflows/deploy-storybook.yml` (push в `main` / `workflow_dispatch`).

В настройках репозитория: **Settings → Pages → Source: GitHub Actions**.

Stories лежат рядом с компонентами (`*.stories.tsx`). Правила для AI: `.cursor/rules/storybook-*.mdc`.

## Разработка библиотеки

```bash
npm install
npm run typecheck
npm run build
npm run dev          # watch
npm run storybook    # UI catalog
npm pack --dry-run   # проверить состав пакета
```

Стек: TypeScript, tsup (ESM + CJS + `.d.ts`), Storybook 10 (`@storybook/react-vite`), React / Leaflet как `peerDependencies`, префиксированные CSS-классы (`sui-*`) и CSS-переменные темы.

## Документация

| Документ | Содержание |
|----------|------------|
| [docs/GITHUB_SETUP.md](./docs/GITHUB_SETUP.md) | Actions, создание PAT, `NODE_AUTH_TOKEN` / `GITHUB_TOKEN`, первая публикация, visibility |
| [docs/CONSUMER_SETUP.md](./docs/CONSUMER_SETUP.md) | Локальный install, secrets в CI, **Vercel**, Next.js, карта, troubleshooting |

## Публикация

1. Поднять `version` в `package.json`.
2. Создать GitHub Release или запушить тег `v*` (например `v0.2.0`).
3. Workflow **Publish** выполнит `npm publish` с  
   `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.

Либо локально после настройки PAT — см. [GITHUB_SETUP.md](./docs/GITHUB_SETUP.md).

## Лицензия

MIT — см. [LICENSE](./LICENSE).
