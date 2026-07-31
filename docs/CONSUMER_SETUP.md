# Подключение `@shappoff/ui` в проектах

Как установить пакет из GitHub Packages **локально**, в **GitHub Actions** и на **Vercel**, включая пошаговое получение `NODE_AUTH_TOKEN` и других секретов.

Пакет: **`@shappoff/ui`**  
Owner / scope: **`@shappoff`**  
Registry: **`https://npm.pkg.github.com`**

Подробности по созданию PAT и публикации самой библиотеки: [GITHUB_SETUP.md](./GITHUB_SETUP.md).

---

## Справочник env и секретов

| Имя | Что это | Откуда | Куда |
|-----|---------|--------|------|
| `NODE_AUTH_TOKEN` | Значение auth-токена для npm | Вы кладёте сюда **PAT** (`ghp_...`) | env процесса `npm install` / secret в Actions |
| `GITHUB_TOKEN` | Автотокен Actions | GitHub создаёт сам в каждом job | Работает для install **только если** пакету выдан доступ к репозиторию потребителя |
| Secret `NODE_AUTH_TOKEN` или `GH_PACKAGES_TOKEN` | PAT, сохранённый в Secrets | Settings → Secrets and variables → Actions | Workflow потребителя: `env.NODE_AUTH_TOKEN: ${{ secrets.... }}` |
| Env `NODE_AUTH_TOKEN` на Vercel | PAT для `npm install` при сборке | Vercel → Project → Settings → Environment Variables | Build/Install на Vercel читает токен из env |
| `.npmrc` mapping | Не секрет | Файл в проекте | `@shappoff:registry=https://npm.pkg.github.com` |

**`NODE_AUTH_TOKEN` GitHub не выдаёт отдельно.** Это имя переменной, которое ожидает npm/`setup-node`. Значение = ваш PAT или (в подходящих случаях) `secrets.GITHUB_TOKEN`.

---

## Часть A. Локальная установка

### A1. Создать PAT с правом чтения пакетов

Минимум для установки: scope **`read:packages`**.  
Если репозиторий пакета private, часто нужен ещё **`repo`**.

Пошагово:

1. Аватар → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token (classic)**.
3. Note: например `read-shappoff-packages`.
4. Scopes: `read:packages` (+ `repo` при необходимости).
5. **Generate token** → скопировать `ghp_...`.

Детали с скриншот-описанием путей: [GITHUB_SETUP.md §3](./GITHUB_SETUP.md#3-создать-personal-access-token-classic--пошагово).

### A2. Добавить `.npmrc` в проект-потребитель

В корне приложения (рядом с `package.json`) создайте файл `.npmrc`:

```ini
@shappoff:registry=https://npm.pkg.github.com
```

Этот файл **можно** коммитить: в нём нет токена, только указание registry для scope `@shappoff`. Остальные пакеты (`react`, `next`, …) по-прежнему идут с registry.npmjs.org.

### A3. Задать токен локально (выберите один способ)

#### Способ 1 — user `~/.npmrc` (рекомендуется для разработки)

Файл:

- Windows: `C:\Users\<Имя>\.npmrc`
- macOS/Linux: `~/.npmrc`

Содержимое:

```ini
//npm.pkg.github.com/:_authToken=ghp_ВАШ_ТОКЕН
```

После этого любой проект с mapping `@shappoff` сможет ставить пакеты без дополнительного env.

#### Способ 2 — переменная окружения `NODE_AUTH_TOKEN`

1. В `.npmrc` **проекта** (опционально, если не используете user `~/.npmrc`):

```ini
@shappoff:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

2. Задайте переменную перед install:

**PowerShell:**

```powershell
$env:NODE_AUTH_TOKEN = "ghp_ВАШ_ТОКЕН"
npm install
```

**bash/zsh:**

```bash
export NODE_AUTH_TOKEN=ghp_ВАШ_ТОКЕН
npm install
```

3. В IDE (WebStorm / VS Code): Run/Debug Configuration → Environment variables →  
   `NODE_AUTH_TOKEN=ghp_...`  
   Либо системные переменные пользователя ОС (без коммита в репозиторий).

#### Способ 3 — `npm login`

```bash
npm login --scope=@shappoff --auth-type=legacy --registry=https://npm.pkg.github.com
```

Username = GitHub login, Password = PAT.

### A4. Установить пакет

```bash
npm install @shappoff/ui
```

### A5. Использование в React / Next.js

```tsx
import { Button, Input, Badge } from "@shappoff/ui";
import "@shappoff/ui/styles.css";

export function Example() {
  return (
    <div>
      <Badge tone="success">Ready</Badge>
      <Input label="Email" name="email" />
      <Button variant="primary">Save</Button>
    </div>
  );
}
```

**Next.js (App Router)** — в `next.config.ts` / `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@shappoff/ui"],
};

export default nextConfig;
```

Требования:

- `react` и `react-dom` ≥ 18 (peer dependencies пакета)
- импорт `@shappoff/ui/styles.css` один раз (например в `app/layout.tsx` или корневом CSS)

### A5.1. Карта (`@shappoff/ui/map`)

Карта вынесена в отдельный entry, чтобы приложения без Leaflet не тянули тяжёлые peers.

1. Установите optional peers:

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

2. Импортируйте стили Leaflet **в клиентском** entry карты (не обязательно в root layout):

```tsx
import "leaflet/dist/leaflet.css";
```

3. В Next.js App Router (в т.ч. `output: "export"`) грузите карту без SSR:

```tsx
"use client";

import dynamic from "next/dynamic";
import { MapSkeleton } from "@shappoff/ui/map";

const MapCanvas = dynamic(() => import("./MapCanvas").then((m) => m.MapCanvas), {
  ssr: false,
  loading: () => <MapSkeleton />,
});
```

```tsx
// MapCanvas.tsx
"use client";

import { LeafletMap, MapMarkerLayer } from "@shappoff/ui/map";
import type { MapMarker } from "@shappoff/ui/map";
import "leaflet/dist/leaflet.css";

const markers: MapMarker[] = [
  { id: "1", lat: 53.9, lng: 27.56, title: "Example" },
];

export function MapCanvas({ ariaLabel }: { ariaLabel: string }) {
  return (
    <LeafletMap ariaLabel={ariaLabel}>
      <MapMarkerLayer markers={markers} variant="primary" />
    </LeafletMap>
  );
}
```

Overlays — только через `children` (`MapMarkerLayer` или свой слой). Датасеты маркеров остаются в приложении.

### A6. Разработка библиотеки без публикации (опционально)

Пока правите `@shappoff/ui` локально:

```bash
# в репозитории библиотеки
npm run build
npm link

# в проекте-потребителе
npm link @shappoff/ui
```

Или в `package.json` потребителя:

```json
{
  "dependencies": {
    "@shappoff/ui": "file:../npm"
  }
}
```

Либо установите tarball: `npm pack` в библиотеке → `npm install ./shappoff-ui-0.1.0.tgz`.

---

## Часть B. GitHub Actions в проекте-потребителе

### B1. Когда какой токен использовать

| Ситуация | Что делать |
|----------|------------|
| Пакет linked к репо, и в Package settings репозиторию потребителя выдан доступ к пакету для Actions | Можно `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` |
| Другой репозиторий / нет доступа у `GITHUB_TOKEN` | Создайте PAT (`read:packages`) и положите в Actions secret |

Ниже — универсальный путь через PAT (работает всегда при валидном токене).

### B2. Создать repository secret — пошагово

1. Откройте репозиторий **потребителя** на GitHub.
2. **Settings** → **Secrets and variables** → **Actions**.
3. **New repository secret**.
4. **Name:** `NODE_AUTH_TOKEN`  
   (или `GH_PACKAGES_TOKEN` — тогда в workflow сделайте маппинг, см. ниже).
5. **Secret:** вставьте PAT (`ghp_...`) со scope `read:packages`.
6. **Add secret**.

Для нескольких репозиториев одной организации удобнее **Organization secret** с ограниченным списком репозиториев:  
Organization → Settings → Secrets and variables → Actions.

Для деплоев с окружениями: **Environments** → Environment secrets.

### B3. Добавить `.npmrc` в репозиторий потребителя

```ini
@shappoff:registry=https://npm.pkg.github.com
```

Без `_authToken` в git. Токен передаётся через env.

### B4. Пример workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
          registry-url: https://npm.pkg.github.com
          scope: "@shappoff"

      - name: Install dependencies
        run: npm ci
        env:
          # Если secret назван NODE_AUTH_TOKEN:
          NODE_AUTH_TOKEN: ${{ secrets.NODE_AUTH_TOKEN }}
          # Если secret назван иначе, например GH_PACKAGES_TOKEN:
          # NODE_AUTH_TOKEN: ${{ secrets.GH_PACKAGES_TOKEN }}

      - run: npm run build
```

`actions/setup-node` с `registry-url` создаёт на runner временный `.npmrc`, который читает **`NODE_AUTH_TOKEN`** из окружения. Поэтому в `env` шага install имя должно быть именно `NODE_AUTH_TOKEN`, даже если secret в UI называется иначе — тогда маппируйте:

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.GH_PACKAGES_TOKEN }}
```

### B5. Вариант с доступом пакета к `GITHUB_TOKEN` потребителя

1. Откройте пакет `@shappoff/ui` → **Package settings** → Manage Actions access (или аналог).
2. Добавьте репозиторий потребителя с ролью чтения.
3. В workflow:

```yaml
permissions:
  contents: read
  packages: read

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: "20"
      registry-url: https://npm.pkg.github.com
      scope: "@shappoff"
  - run: npm ci
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Отдельный PAT тогда не нужен.

---

## Часть C. Vercel (проект-потребитель)

На Vercel `npm install` / `npm ci` выполняется в облаке при каждом деплое. Для private-пакета из GitHub Packages нужен тот же mapping в `.npmrc` и токен в Environment Variables проекта.

### C1. Подготовка репозитория

В корне приложения (то, что деплоится на Vercel) должны быть:

1. Зависимость в `package.json`:

```json
{
  "dependencies": {
    "@shappoff/ui": "^0.1.0"
  }
}
```

2. Файл `.npmrc` **без токена** (можно коммитить):

```ini
@shappoff:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Строка с `${NODE_AUTH_TOKEN}` нужна, чтобы npm на Vercel подставил значение из env при install. Mapping `@shappoff:registry=...` обязателен.

3. Для Next.js — `transpilePackages: ["@shappoff/ui"]` (см. [A5](#a5-использование-в-react--nextjs)).

### C2. Создать PAT (если ещё нет)

Scope минимум: **`read:packages`** (+ **`repo`**, если пакет/репозиторий private).  
Пошагово: [A1](#a1-создать-pat-с-правом-чтения-пакетов) или [GITHUB_SETUP.md §3](./GITHUB_SETUP.md#3-создать-personal-access-token-classic--пошагово).

Тот же PAT, что для локальной разработки / Actions, подойдёт — либо отдельный токен только для Vercel (удобнее ротировать).

### C3. Добавить переменную в Vercel — пошагово

1. Откройте [vercel.com](https://vercel.com) → ваш **Project** (приложение-потребитель).
2. **Settings** → **Environment Variables**.
3. Создайте переменную:
   - **Key:** `NODE_AUTH_TOKEN`
   - **Value:** PAT (`ghp_...`)
   - **Environments:** отметьте **Production**, **Preview** и при необходимости **Development** (иначе Preview-деплои упадут на install).
4. Сохраните (**Save**).
5. Если проект уже был задеплоен — сделайте **Redeploy** последнего деплоя (или пустой commit / Redeploy без cache), чтобы install прошёл уже с новым env.

Имя должно быть именно **`NODE_AUTH_TOKEN`**, потому что так написано в `.npmrc` (`${NODE_AUTH_TOKEN}`).

### C4. Проверка Install Command (обычно ничего менять не нужно)

Vercel по умолчанию запускает `npm install` / `npm ci` в корне проекта. Убедитесь:

- Root Directory указывает на папку с `package.json` и `.npmrc` (для monorepo — на пакет приложения).
- Custom Install Command, если задан, тоже видит `NODE_AUTH_TOKEN` (env доступны на этапе install/build).

Пример кастомной команды не требуется — достаточно env + `.npmrc`.

### C5. Использование в коде на Vercel

То же, что локально:

```tsx
import { Button, Input, Badge } from "@shappoff/ui";
import "@shappoff/ui/styles.css";
```

Импорт стилей — один раз (например в `app/layout.tsx`). Сборка на Vercel подхватит пакет после успешного `npm install`.

### C6. Vercel + GitHub (без отдельного PAT) — ограничения

`GITHUB_TOKEN` из GitHub Actions на Vercel **недоступен**. Для install на Vercel почти всегда нужен **PAT в Environment Variables**.

Альтернативы (редко нужны):

- сделать пакет public (для внутренних UI обычно не подходит);
- зеркалировать пакет в другой registry с доступом Vercel.

Практичный путь для `@shappoff/ui`: **PAT → `NODE_AUTH_TOKEN` в Vercel**.

### C7. Checklist перед первым деплоем

- [ ] В git есть `.npmrc` с registry + `${NODE_AUTH_TOKEN}`
- [ ] В Vercel задан `NODE_AUTH_TOKEN` для Production и Preview
- [ ] PAT живой, scopes `read:packages` (+ `repo` при необходимости)
- [ ] Аккаунт PAT имеет доступ к private-пакету `@shappoff/ui`
- [ ] Next.js: `transpilePackages` включает `@shappoff/ui`
- [ ] После добавления env сделан Redeploy

---

## Часть D. Безопасность

- Не коммитьте `ghp_...` и строки `_authToken=ghp_...` в git (в `.npmrc` только `${NODE_AUTH_TOKEN}`).
- Давайте PAT минимальные scopes (`read:packages` для потребителей).
- Ротируйте токены по истечении срока; обновите `~/.npmrc`, Actions secrets и **Vercel Environment Variables**.
- Для форков PR: secrets обычно недоступны — учитывайте это в CI.
- В Vercel не включайте `NODE_AUTH_TOKEN` в клиентский бандл: переменная нужна только на install/build; не используйте префикс `NEXT_PUBLIC_`.

---

## Troubleshooting у потребителя

| Симптом | Решение |
|---------|---------|
| `401` при `npm install` | Нет/неверный токен; не задан `NODE_AUTH_TOKEN`; PAT без `read:packages` |
| `404` / `Not found` | Неверный scope/имя; пакет private и нет доступа; опечатка `@shappoff/ui` |
| Стили «не те» | Импортируйте `@shappoff/ui/styles.css`; проверьте CSS-переменные |
| Next.js ошибки по пакету | Добавьте `transpilePackages: ['@shappoff/ui']` |
| Карта: `window is not defined` | `next/dynamic` с `ssr: false`; не импортируйте `@shappoff/ui/map` в Server Component без dynamic |
| Карта: нет тайлов / сломан layout | Импортируйте `leaflet/dist/leaflet.css` в client chunk карты |
| Карта: peer warnings / missing module | `npm install leaflet react-leaflet` (+ `@types/leaflet`) |
| CI ок локально, падает в Actions | Secret не добавлен / неверное имя; нет `registry-url` у `setup-node` |
| Vercel: `401` на install | Нет env `NODE_AUTH_TOKEN` / не для Preview; в `.npmrc` нет `${NODE_AUTH_TOKEN}`; PAT без доступа |
| Vercel: локально ок, деплой падает | Env добавлен после деплоя — нужен Redeploy; Root Directory без `.npmrc` |
| Vercel: `404` на `@shappoff/ui` | Нет mapping `@shappoff:registry=...` в задеплоенном `.npmrc` |

---

## Связанные документы

- [Настройка GitHub и публикация библиотеки](./GITHUB_SETUP.md)
- [README](../README.md)
