# Настройка GitHub для `@shappoff/ui`

Пошаговая инструкция: репозиторий, токены, env-переменные, публикация в GitHub Packages и права доступа.

Пакет: **`@shappoff/ui`**  
Репозиторий: **`https://github.com/shappoff/npm`**  
Registry: **`https://npm.pkg.github.com`**

---

## 1. Репозиторий и Actions

1. Откройте [github.com/shappoff/npm](https://github.com/shappoff/npm).
2. Убедитесь, что у вас есть права на запись (owner / write).
3. Перейдите в **Settings → Actions → General**.
4. В блоке **Actions permissions** выберите разрешение запускать workflows (обычно *Allow all actions and reusable workflows*).
5. В блоке **Workflow permissions** можно оставить *Read repository contents and packages permissions*; в `publish.yml` права задаются явно через `permissions: packages: write`.

Workflows в репозитории:

- `.github/workflows/ci.yml` — typecheck + build на push/PR в `main`
- `.github/workflows/publish.yml` — публикация в GitHub Packages при Release или теге `v*`

---

## 2. Справочник: токены и переменные окружения

| Имя | Что это | Откуда берётся | Где используется |
|-----|---------|----------------|------------------|
| `NODE_AUTH_TOKEN` | Значение токена для npm ↔ GitHub Packages. **Отдельной «выдачи» с таким именем у GitHub нет** — это соглашение npm / `actions/setup-node` | В переменную кладут **PAT** (`ghp_...`) или в CI этого репо — **`GITHUB_TOKEN`** | `env` при `npm ci` / `npm publish`; в `.npmrc` как `${NODE_AUTH_TOKEN}` |
| `GITHUB_TOKEN` | Встроенный токен GitHub Actions | Создаётся GitHub автоматически в каждом job | Publish **из этого же** репозитория `shappoff/npm` |
| Secret с PAT (например `GH_PACKAGES_TOKEN`) | Ваш Personal Access Token, сохранённый как secret | Settings → Secrets and variables → Actions | Нужен в **других** репозиториях-потребителях (см. [CONSUMER_SETUP.md](./CONSUMER_SETUP.md)) |
| Mapping в `.npmrc` | Не секрет | Файл в репозитории | `@shappoff:registry=https://npm.pkg.github.com` |

Важно:

- Имя **`NODE_AUTH_TOKEN`** выбрано потому, что `actions/setup-node` при `registry-url` пишет в `.npmrc` строку с `${NODE_AUTH_TOKEN}`.
- Токен **нельзя** коммитить в git. В репозитории пакета в `.npmrc` только mapping scope → registry (без `_authToken`).

---

## 3. Создать Personal Access Token (classic) — пошагово

GitHub Packages для npm требует **PAT (classic)** (fine-grained tokens для Packages поддерживаются ограниченно; для надёжности используйте classic).

### 3.1. Открыть форму создания токена

1. Войдите в GitHub под аккаунтом **`shappoff`** (или аккаунтом с нужными правами).
2. Нажмите аватар (правый верхний угол) → **Settings**.
3. В левом меню в самом низу: **Developer settings**.
4. **Personal access tokens** → **Tokens (classic)**.
5. **Generate new token** → **Generate new token (classic)**.
6. При запросе пароля / 2FA подтвердите вход.

Прямая ссылка: [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)

### 3.2. Заполнить поля

1. **Note** — понятное имя, например `github-packages-shappoff-ui`.
2. **Expiration** — срок жизни (рекомендуется не «No expiration»; например 90 дней + напоминание о ротации).
3. **Select scopes** отметьте:
   - `read:packages` — установка пакетов из GitHub Packages
   - `write:packages` — публикация (нужно для локального `npm publish`)
   - `repo` — часто нужен, если репозиторий **private** и пакет связан с ним
4. Нажмите **Generate token**.

### 3.3. Скопировать значение

1. Скопируйте токен сразу (формат `ghp_...`).
2. Сохраните в менеджер паролей. **Повторно посмотреть значение нельзя** — только создать новый токен.

Этот `ghp_...` и есть значение, которое вы позже подставите в:

- `~/.npmrc` как `_authToken`, или
- переменную окружения **`NODE_AUTH_TOKEN`**, или
- GitHub Actions secret в другом репозитории.

---

## 4. Локальная аутентификация к GitHub Packages

В корне этого репозитория уже есть `.npmrc` **без секрета**:

```ini
@shappoff:registry=https://npm.pkg.github.com
```

Токен добавляйте одним из способов ниже.

### Вариант A — user-level `~/.npmrc` (удобно для ежедневной работы)

1. Откройте (или создайте) файл:
   - Windows: `C:\Users\<Имя>\.npmrc`
   - macOS / Linux: `~/.npmrc`
2. Добавьте строку (подставьте свой токен):

```ini
//npm.pkg.github.com/:_authToken=ghp_ВАШ_ТОКЕН
```

3. Сохраните файл. Убедитесь, что `~/.npmrc` **не** попадает в git.

### Вариант B — переменная `NODE_AUTH_TOKEN` (удобно для CI-подобных сценариев локально)

1. В проектном `.npmrc` (если нужно явно) можно использовать:

```ini
@shappoff:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

В **этом** репозитории библиотеки mapping уже есть; для publish из того же репо через Actions токен подставляет workflow.

2. Задайте переменную в текущей сессии терминала.

**Windows PowerShell:**

```powershell
$env:NODE_AUTH_TOKEN = "ghp_ВАШ_ТОКЕН"
npm publish
```

**Windows CMD:**

```bat
set NODE_AUTH_TOKEN=ghp_ВАШ_ТОКЕН
npm publish
```

**macOS / Linux (bash/zsh):**

```bash
export NODE_AUTH_TOKEN=ghp_ВАШ_ТОКЕН
npm publish
```

3. Для постоянной переменной пользователя (Windows):  
   **Параметры → Система → О программе → Дополнительные параметры системы → Переменные среды** → создать `NODE_AUTH_TOKEN`.  
   Не коммитьте значение и не шарьте его в чатах.

### Вариант C — `npm login`

```bash
npm login --scope=@shappoff --auth-type=legacy --registry=https://npm.pkg.github.com
```

- **Username:** `shappoff` (ваш GitHub username)
- **Password:** вставьте PAT (`ghp_...`), не пароль от GitHub
- **Email:** любой валидный email аккаунта

---

## 5. Первая публикация пакета

Перед публикацией версия в `package.json` должна быть уникальной (сейчас стартовая `0.1.0`).

### 5.1. Локально

```bash
npm install
npm run build
npm publish
```

`publishConfig.registry` в `package.json` направляет publish на GitHub Packages, а не на npmjs.org.

Проверка состава tarball без публикации:

```bash
npm pack --dry-run
```

В архиве должны быть в основном файлы из `dist/` (+ metadata).

### 5.2. Через GitHub Actions (рекомендуется)

1. Убедитесь, что код запушен в `main`, CI зелёный.
2. Поднимите версию в `package.json` при необходимости (например `0.1.0` → `0.1.1`).
3. Создайте git-тег и/или GitHub Release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Или: **Releases → Draft a new release** → Tag `v0.1.0` → Publish release.

4. Workflow **Publish** запустится автоматически.
5. В job используется:

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Отдельный PAT для публикации **из этого же** репозитория обычно **не нужен**: `GITHUB_TOKEN` с `permissions.packages: write` достаточен.

6. После успеха пакет появится: репозиторий → правая колонка **Packages**, либо  
   `https://github.com/shappoff?tab=packages`

---

## 6. Настройки пакета на GitHub (visibility и доступ)

1. Откройте страницу пакета `@shappoff/ui`.
2. **Package settings** (или Manage → Package settings).
3. **Danger Zone / Visibility**: для внутренних проектов оставьте **Private** (при первой публикации по умолчанию private).
4. Убедитесь, что пакет **связан с репозиторием** `shappoff/npm` (поле `repository` в `package.json` помогает при publish).
5. Настройте, кто может читать пакет (Inherit from repository или явные роли).
6. Для установки из **других** репозиториев через их `GITHUB_TOKEN`:
   - в настройках пакета добавьте доступ для Actions этих репозиториев  
   - **или** используйте PAT + secret (см. [CONSUMER_SETUP.md](./CONSUMER_SETUP.md))

---

## 7. Что проверить после публикации

- [ ] В UI GitHub виден пакет `@shappoff/ui` версии `0.1.0` (или вашей)
- [ ] Workflow Publish — зелёный
- [ ] Локально с PAT: `npm view @shappoff/ui --registry=https://npm.pkg.github.com`
- [ ] В тестовом проекте ставится зависимость (инструкция в CONSUMER_SETUP)

---

## 8. Troubleshooting

| Симптом | Что проверить |
|---------|----------------|
| `401 Unauthorized` | PAT просрочен / нет scopes; `NODE_AUTH_TOKEN` не задан; опечатка в токене |
| `403 Forbidden` | Нет `write:packages` / `read:packages`; нет доступа к private package; SSO org не authorize токен |
| Пакет ушёл на npmjs.org | Нет `publishConfig.registry` или переопределён registry; проверьте `.npmrc` |
| `package already exists` | Версия в `package.json` уже опубликована — увеличьте version |
| Actions: publish падает на auth | В workflow есть `registry-url`, `scope: '@shappoff'`, `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`, `permissions.packages: write` |
| Scope / имя | Имя пакета только lowercase; scope должен быть `@shappoff` |

### Ротация PAT

1. Создайте новый classic token (раздел 3).
2. Обновите `~/.npmrc` / env / secrets в потребителях.
3. Удалите (Revoke) старый токен в Developer settings.

---

## Связанные документы

- [Подключение пакета в проектах (локально, CI и Vercel)](./CONSUMER_SETUP.md)
- [README](../README.md)
