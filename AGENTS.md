# AGENTS.md — Руководство для AI-агентов

## Описание проекта

**Markdown Redactor** — Markdown-редактор для Windows 11, построенный на Tauri 2 (Rust backend + React/TypeScript frontend). Использует Milkdown Crepe для визуального редактирования и Zustand для управления состоянием.

---

## Команды сборки, проверки и тестирования

### Frontend (TypeScript/React)

```bash
npm run dev          # Запуск в режиме разработки (Vite + Tauri)
npm run build        # Сборка production (tsc && vite build)
npm run preview      # Просмотр production-сборки
npm run test         # Запуск всех тестов (vitest run)
npm run test:watch   # Тесты в режиме наблюдения
npx vitest run src/test/appStore.test.ts     # Запуск одного тестового файла
npx vitest run --reporter=verbose             # Подробный вывод
npm run tauri dev    # Запуск Tauri в режиме разработки
npm run tauri build  # Сборка Tauri-приложения
```

### Backend (Rust)

```bash
cd src-tauri
cargo build          # Сборка
cargo check          # Быстрая проверка типов
cargo clippy         # Линтер
cargo test           # Запуск тестов
cargo test --test <name>  # Запуск конкретного теста
```

### Проверка типов

```bash
npx tsc --noEmit     # Проверка TypeScript
```

---

## Архитектура проекта

```
src/
├── components/          # React-компоненты (по папкам)
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

---

## Стиль кода: TypeScript/React

### Импорты

```typescript
// 1. React и внешние библиотеки
import { useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

// 2. Внутренние модули (относительные пути)
import { useAppStore } from '../stores/appStore';
import type { Settings } from '../types';

// 3. CSS
import './component.css';
```

### Типизация

- Использовать `type` для типов объектов, `interface` для расширяемых сущностей
- Явные типы для параметров функций и возвращаемых значений
- Использовать `Partial<T>` для опциональных обновлений
- Избегать `any`, использовать `unknown` при необходимости

```typescript
// Хорошо
export function useFile(): {
  open: () => Promise<void>;
  save: () => Promise<void>;
} { ... }

// Типы в отдельном файле src/types/index.ts
export type EditorMode = 'visual' | 'source';
```

### Компоненты

- Функциональные компоненты с именованными экспортами
- Хуки в начале компонента
- Рефы для доступа к DOM и стабильных колбэков

```typescript
export function Editor() {
  const content = useAppStore((s) => s.content);
  const setContent = useAppStore((s) => s.setContent);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((value: string) => {
    setContentRef.current(value);
  }, []);

  return ( ... );
}
```

### Состояние (Zustand)

- Использовать селекторы для оптимизации ре-рендеров
- Именование: `use + сущность + Store`

```typescript
// Селектор
const content = useAppStore((s) => s.content);

// Деструктуризация для нескольких значений
const { filePath, content, setContent } = useAppStore();
```

### Обработка ошибок

- try/catch для async операций
- Пользовательские сообщения на русском

```typescript
try {
  await tauri.saveFile(path, content);
} catch (e) {
  console.error('Ошибка сохранения:', e);
}
```

---

## Стиль кода: Rust

### Структура команд

```rust
#[tauri::command]
pub async fn open_file(app: tauri::AppHandle) -> Result<FileData, String> {
  // ...
}
```

### Сериализация

- `#[derive(Serialize, Deserialize)]` для структур
- `#[serde(default = "fn_name")]` для значений по умолчанию

### Обработка ошибок

- Возвращать `Result<T, String>` с русскими сообщениями об ошибках
- Использовать `.map_err(|e| format!("Описание: {}", e))?`

---

## Стиль кода: CSS

- Отдельный CSS-файл для каждого компонента
- CSS-переменные в `themes/variables.css`
- Классы в kebab-case: `.statusbar-item`

---

## Тестирование

### Настройка

- Vitest с jsdom и globals
- Setup файл: `src/test/setup.ts` (моки Tauri API)

### Структура теста

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
  beforeEach(() => {
    // Сброс состояния
    useAppStore.setState({ ... });
  });

  it('должен ...', () => {
    // Arrange, Act, Assert
    render(<Component />);
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
```

### Мокирование

```typescript
// В setup.ts
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));
```

---

## Комментарии

- Комментарии в коде писать **на русском языке**
- Пояснять нетривиальную логику

---

## Важные паттерны

1. **Tauri IPC**: все вызовы через обёртки в `utils/tauri.ts`
2. **Store**: Zustand с селекторами, не деструктурировать весь store в компонентах
3. **Хуки**: кастомные хуки для инкапсуляции логики (useFile, useSettings)
4. **Типы**: централизованно в `types/index.ts`, синхронизировать с Rust структурами
5. **Горячие клавиши**: обрабатываются в `App.tsx` через `useEffect` + `addEventListener`
