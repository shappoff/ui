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
import { Button, Input, Badge } from "@shappoff/ui";
import "@shappoff/ui/styles.css";
```

Next.js: добавьте `transpilePackages: ["@shappoff/ui"]` в конфиг.

## Примерные компоненты

| Компонент | Назначение |
|-----------|------------|
| `Button` | Кнопка: `variant`, `size`, `forwardRef` |
| `Input` | Поле ввода: `label`, `error`, `forwardRef` |
| `Badge` | Метка: `tone` (`neutral` \| `success` \| `warning`) |

Набор будет расширяться; публичный API — через `src/index.ts`.

## Структура проекта

```text
npm/
├── .github/workflows/
│   ├── ci.yml                 # typecheck + build
│   └── publish.yml            # publish в GitHub Packages (release / tag v*)
├── docs/
│   ├── GITHUB_SETUP.md        # GitHub, PAT, NODE_AUTH_TOKEN, публикация
│   └── CONSUMER_SETUP.md      # установка локально и в CI потребителей
├── src/
│   ├── index.ts               # публичный API
│   ├── styles.css             # CSS-переменные и стили компонентов
│   └── components/
│       ├── Button/
│       ├── Input/
│       └── Badge/
├── .npmrc                     # mapping @shappoff → GitHub Packages (без токена)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── LICENSE
└── README.md
```

После `npm run build` в `dist/` попадают ESM, CJS, типы и `styles.css`. В npm-пакет входит только `dist/` (`files` в `package.json`).

## Разработка библиотеки

```bash
npm install
npm run typecheck
npm run build
npm run dev          # watch
npm pack --dry-run   # проверить состав пакета
```

Стек: TypeScript, tsup (ESM + CJS + `.d.ts`), React как `peerDependencies`, префиксированные CSS-классы (`sui-*`) и CSS-переменные темы.

## Документация

| Документ | Содержание |
|----------|------------|
| [docs/GITHUB_SETUP.md](./docs/GITHUB_SETUP.md) | Actions, создание PAT, `NODE_AUTH_TOKEN` / `GITHUB_TOKEN`, первая публикация, visibility |
| [docs/CONSUMER_SETUP.md](./docs/CONSUMER_SETUP.md) | Локальный install, secrets в CI, Next.js, troubleshooting |

## Публикация

1. Поднять `version` в `package.json`.
2. Создать GitHub Release или запушить тег `v*` (например `v0.1.0`).
3. Workflow **Publish** выполнит `npm publish` с  
   `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.

Либо локально после настройки PAT — см. [GITHUB_SETUP.md](./docs/GITHUB_SETUP.md).

## Лицензия

MIT — см. [LICENSE](./LICENSE).
