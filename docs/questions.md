Стало заметно лучше 👍 Ниже — что бы я ещё поправил/добавил (без “переписывать всё заново”).

## 1) `font: var(--button-font-size)` лучше заменить

`font` — shorthand и может снести семейство/вес/line-height. Надёжнее:

```scss
font-size: var(--button-font-size);
```

Если у тебя `--font-medium-text-base` уже “комплектный” шортхенд (размер/line-height/семейство) — тогда ок, но это редкость. Я бы всё равно делал `font-size`.

## 2) Hover должен не срабатывать на disabled + лучше через media

Сейчас у тебя `:hover` может примениться, даже если disabled (зависит от браузера/порядка). Сделай так:

```scss
@media (hover: hover) {
  &:not(:disabled):hover { ... }
}
&:not(:disabled):active { ... }
```

Это и “залипание hover” на мобилках лечит, и disabled гарантированно не подсвечивается.

## 3) `min-width: fit-content` скорее лишнее

`width: fit-content` уже делает своё. `min-width: fit-content` может давать странности. Я бы оставил только `width: fit-content` (или вообще `inline-flex` и без width):

**Вариант проще и типичный для кнопки:**

```scss
display: inline-flex;
width: auto;
```

Если нужен именно “по контенту” — `inline-flex` решает это естественно.

## 4) Добавь `:focus-visible` (а11y)

Минимум:

```scss
&:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

(подставь свой токен)

## 5) Disabled: лучше отключить pointer events

Сейчас только cursor. Если вдруг где-то есть hover/active или кастомные обработчики — безопаснее:

```scss
&:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
```

## 6) Лёгкая чистка SCSS-переменных (не обязательно)

Ты завёл `--btn-fill-*-disabled` и `--btn-outline-*-disabled` в `.BaseButton` — это круто. Но в `.BaseButton_color_*` ты не переопределяешь disabled токены по цветам (и это нормально). Просто имей в виду: если однажды захочешь “disabled primary” отличать от “disabled default”, у тебя уже есть структура.

## 7) TS: `TypeButton` можно не выносить

Чисто вкусовщина, но можно проще:

```ts
type Props = {
  // ...
  type?: 'button' | 'submit' | 'reset'
}
```

---

### Мини-патч (самое полезное)

Если хочешь прямо готовым куском заменить в `.BaseButton_variant_fill/outline`:

```scss
.BaseButton_variant_fill {
  background: var(--btn-fill-bg);
  color: var(--btn-fill-clr-text);

  @media (hover: hover) {
    &:not(:disabled):hover {
      background: var(--btn-fill-bg-hover);
    }
  }

  &:not(:disabled):active {
    background: var(--btn-fill-bg-active);
  }

  &:disabled {
    background: var(--btn-fill-bg-disabled);
    color: var(--btn-fill-clr-text-disabled);
  }
}
```

То же для outline.

Если покажешь, какие у тебя токены для focus (`--color-border-focus` или аналог) — подставлю точный вариант под твою дизайн-систему.
