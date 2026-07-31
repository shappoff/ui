# Подключение `@shappoff/ui` в проектах

Как установить пакет из GitHub Packages **локально** и в **GitHub Actions**, включая пошаговое получение `NODE_AUTH_TOKEN` и других секретов.

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

## Часть C. Безопасность

- Не коммитьте `ghp_...` и строки `_authToken=...` в git.
- Давайте PAT минимальные scopes (`read:packages` для потребителей).
- Ротируйте токены по истечении срока; обновите `~/.npmrc` и Actions secrets.
- Для форков PR: secrets обычно недоступны — учитывайте это в CI.

---

## Troubleshooting у потребителя

| Симптом | Решение |
|---------|---------|
| `401` при `npm install` | Нет/неверный токен; не задан `NODE_AUTH_TOKEN`; PAT без `read:packages` |
| `404` / `Not found` | Неверный scope/имя; пакет private и нет доступа; опечатка `@shappoff/ui` |
| Стили «не те» | Импортируйте `@shappoff/ui/styles.css`; проверьте CSS-переменные |
| Next.js ошибки по пакету | Добавьте `transpilePackages: ['@shappoff/ui']` |
| CI ок локально, падает в Actions | Secret не добавлен / неверное имя; нет `registry-url` у `setup-node` |

---

## Связанные документы

- [Настройка GitHub и публикация библиотеки](./GITHUB_SETUP.md)
- [README](../README.md)
