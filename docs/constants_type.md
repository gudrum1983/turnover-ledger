````md
# `as const` — мини-памятка (TypeScript)

## Что это такое
`as const` — это **const assertion**.  
Он говорит TypeScript:

> “Сохрани значения **как литералы**, а не обобщай их до `string | number | boolean`”.

---

## `const` ≠ `as const`

```ts
export const ROUTES = {
  reportBuilder: {
    name: 'reportBuilder',
    path: '/',
  },
}
````

Тип будет:

```ts
{
  reportBuilder: {
    name: string
    path: string
  }
}
```

⬆️ значения **расширены** до `string`.

---

```ts
export const ROUTES = {
  reportBuilder: {
    name: 'reportBuilder',
    path: '/',
  },
} as const
```

Тип будет:

```ts
{
  readonly reportBuilder: {
    readonly name: 'reportBuilder'
    readonly path: '/'
  }
}
```

⬆️ значения **зафиксированы как литералы**.

---

## Что даёт `as const`

### 1️⃣ Защита от опечаток

```ts
router.push({ name: ROUTES.reportPreview.name }) // ✅
router.push({ name: 'reportPreveiw' })           // ❌ ошибка TS
```

---

### 2️⃣ Удобные union-типы

```ts
type RouteName = typeof ROUTES[keyof typeof ROUTES]['name']
// 'reportBuilder' | 'reportPreview' | 'notFound'
```

---

### 3️⃣ Отлично для сравнений

```ts
if (route.name === ROUTES.reportPreview.name) {
  // TS знает точное значение
}
```

---

### 4️⃣ Иммутабельность

```ts
ROUTES.reportBuilder.path = '/home' // ❌ нельзя
```

---

## Где особенно полезен `as const`

* `ROUTES`
* `PERMISSIONS`
* `FEATURE_FLAGS`
* `STATUS_MAP`
* `ROLE_MAP`
* любые “таблицы конфигурации”

---

## Когда `as const` НЕ нужен

* простые переменные
* временные объекты
* данные, которые будут мутироваться
* JS-проекты без TypeScript

---

## Короткое правило

> **`as const` нужен, когда объект — источник правды, а не просто данные.**

---

## Частые ошибки

❌ Писать `as const` ради всего подряд
❌ Мутировать объект с `as const`
❌ Путать `const` и `as const`

---

## TL;DR

* `const` → переменная не переопределяется
* `as const` → **значения не расширяются**
* идеально для конфигов и роутов

```

Если хочешь, могу сделать такую же памятку про:
- `keyof typeof`
- `satisfies`
- `readonly`
- или собрать **TypeScript-cheat-sheet под твой проект**
```
