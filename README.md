
# Markdown Redactor (EN)

**Markdown Redactor** is a modern Markdown editor for Windows 11, built on Tauri 2. The application combines a powerful Rust backend with a modern React/TypeScript frontend featuring the Milkdown Crepe visual editor.

## 🚀 Features

* **Visual editor** based on Milkdown Crepe with WYSIWYG support

* **Two editing modes**: visual and Markdown source code

* **Theme switching** (light/dark) with persistent settings

* **Real-time statistics** counter (words, characters, characters without spaces)

* **Full Windows 11 integration** (native look, performance)

* **Auto-save** and file management

* **Keyboard shortcuts** for common operations

## 🏗️ Architecture

### Tech Stack

* **Backend**: Rust + Tauri 2

* **Frontend**: React 18 + TypeScript

* **Editor**: Milkdown Crepe

* **State Management**: Zustand

* **Build Tool**: Vite

* **Styling**: CSS with CSS variables

### Project Structure

```
src/
├── components/          # React components
│   ├── Editor/          # Milkdown Crepe editor
│   ├── StatusBar/       # Status bar (words, characters)
│   ├── TitleBar/        # Window title bar
│   └── Toolbar/         # Toolbar
├── hooks/               # Custom hooks
│   ├── useFile.ts       # File operations
│   ├── useSettings.ts   # Application settings
│   └── useTheme.ts      # Theme switching
├── stores/              # Zustand store
│   └── appStore.ts      # Global state
├── types/               # TypeScript types
│   └── index.ts         # All interfaces
├── utils/               # Utilities
│   └── tauri.ts         # Tauri IPC wrappers
├── test/                # Tests
│   └── setup.ts         # Tauri API mocks
└── themes/              # CSS themes (light/dark/variables)

src-tauri/src/
├── lib.rs               # Tauri entry point
├── main.rs              # Main
└── commands.rs          # Tauri IPC commands
```

## ⌨️ Keyboard Shortcuts

* `Ctrl+S` — Save file

* `Ctrl+O` — Open file

* `Ctrl+N` — New file

* `Ctrl+Shift+S` — Save as

* `F11` — Fullscreen mode

* `Ctrl+T` — Toggle theme

## 🎨 Themes

The application supports two themes:

* **Light** — classic theme for daytime work

* **Dark** — comfortable theme for low-light environments

Theme settings are saved locally and restored on startup.

***

# Markdown Redactor (RU)

**Markdown Redactor** — современный Markdown-редактор для Windows 11, построенный на Tauri 2. Приложение объединяет мощный Rust-бэкенд и современный React/TypeScript фронтенд с визуальным редактором Milkdown Crepe.

## 🚀 Возможности

* **Визуальный редактор** на основе Milkdown Crepe с поддержкой WYSIWYG

* **Два режима редактирования**: визуальный и исходный код Markdown

* **Переключение тем** (светлая/темная) с сохранением настроек

* **Счетчик статистики** в реальном времени (слова, символы, символы без пробелов)

* **Полная интеграция с Windows 11** (нативный вид, производительность)

* **Автосохранение** и управление файлами

* **Горячие клавиши** для основных операций

## 🏗️ Архитектура

### Технологический стек

* **Backend**: Rust + Tauri 2

* **Frontend**: React 18 + TypeScript

* **Редактор**: Milkdown Crepe

* **Состояние**: Zustand

* **Сборка**: Vite

* **Стилизация**: CSS с CSS-переменными

### Структура проекта

```
src/
├── components/          # React-компоненты
│   ├── Editor/          # Milkdown Crepe редактор
│   ├── StatusBar/       # Статус-бар (слова, символы)
│   ├── TitleBar/        # Заголовок окна
│   └── Toolbar/         # Панель инструментов
├── hooks/               # Кастомные хуки
│   ├── useFile.ts       # Операции с файлами
│   ├── useSettings.ts   # Настройки приложения
│   └── useTheme.ts      # Переключение темы
├── stores/              # Zustand store
│   └── appStore.ts      # Глобальное состояние
├── types/               # TypeScript типы
│   └── index.ts         # Все интерфейсы
├── utils/               # Утилиты
│   └── tauri.ts         # Обёртки над Tauri IPC
├── test/                # Тесты
│   └── setup.ts         # Моки для Tauri API
└── themes/              # CSS-темы (light/dark/variables)

src-tauri/src/
├── lib.rs               # Точка входа Tauri
├── main.rs              # Main
└── commands.rs          # Tauri IPC команды
```

## 🛠️ Установка и запуск

### Требования

* Node.js 18+

* Rust 1.70+

* Windows 11

### Установка зависимостей

```bash
# Frontend зависимости
npm install

# Rust зависимости (автоматически при первом запуске)
cd src-tauri
cargo build
```

### Команды разработки

#### Frontend (TypeScript/React)

```bash
npm run dev          # Запуск в режиме разработки (Vite + Tauri)
npm run build        # Сборка production (tsc && vite build)
npm run preview      # Просмотр production-сборки
npm run test         # Запуск всех тестов (vitest run)
npm run test:watch   # Тесты в режиме наблюдения
npx vitest run src/test/appStore.test.ts     # Запуск одного тестового файла
npx vitest run --reporter=verbose             # Подробный вывод
```

#### Tauri приложение

```bash
npm run tauri dev    # Запуск Tauri в режиме разработки
npm run tauri build  # Сборка Tauri-приложения
```

#### Backend (Rust)

```bash
cd src-tauri
cargo build          # Сборка
cargo check          # Быстрая проверка типов
cargo clippy         # Линтер
cargo test           # Запуск тестов
cargo test --test <name>  # Запуск конкретного теста
```

#### Проверка типов

```bash
npx tsc --noEmit     # Проверка TypeScript
```

## 🧪 Тестирование

Проект использует Vitest для тестирования React-компонентов и Cargo для тестирования Rust кода.

### Запуск тестов

```bash
# Все тесты
npm run test

# Конкретный файл
npx vitest run src/test/appStore.test.ts

# Тесты в режиме наблюдения
npm run test:watch

# Rust тесты
cd src-tauri && cargo test
```

### Структура тестов

* Тесты находятся в `src/test/`

* Setup файл: `src/test/setup.ts` (моки Tauri API)

* Используется Testing Library для React-компонентов

## ⌨️ Горячие клавиши

* `Ctrl+S` — Сохранить файл

* `Ctrl+O` — Открыть файл

* `Ctrl+N` — Новый файл

* `Ctrl+Shift+S` — Сохранить как

* `F11` — Полноэкранный режим

* `Ctrl+T` — Переключение темы

## 🎨 Темы

Приложение поддерживает две темы:

* **Светлая** — классическая тема для дневной работы

* **Темная** — комфортная тема для работы в слабом освещении

Настройки темы сохраняются локально и восстанавливаются при запуске.

## 📝 Особенности реализации

### Управление состоянием

* Используется Zustand для глобального состояния

* Оптимизация ре-рендеров через селекторы

* Персистентность настроек через localStorage

### IPC коммуникация

* Все вызовы к Rust-бэкенду через обёртки в `utils/tauri.ts`

* Типизированные интерфейсы для TypeScript

* Обработка ошибок с русскими сообщениями

### Редактор Milkdown Crepe

* Визуальное редактирование с превью

* Поддержка стандартных Markdown-элементов

* Расширяемая архитектура плагинов

## 🚀 Сборка для продакшена

```bash
# Сборка фронтенда
npm run build

# Сборка Tauri приложения
npm run tauri build

# Результат будет в src-tauri/target/release/bundle/
```

## 🛠️ Recommended IDE Setup

* [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

### Полезные расширения VS Code

* **Tailwind CSS IntelliSense** — для работы с CSS

* **TypeScript Importer** — автоматический импорт

* **ESLint** — проверка кода

* **Prettier** — форматирование кода

## 📄 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit ваши изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

