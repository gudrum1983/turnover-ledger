# Нейминг классов и компонентов

В проекте используется БЭМ-нотация в **стиле React**:

`BlockName-ElemName_modName_modVal`

Название стиля относится к схеме именования CSS-классов. В проекте она применяется к Vue-компонентам.

## Базовые правила

1. Каждый Vue-компонент с разметкой считается блоком. Имя блока совпадает с именем компонента.
2. Корневой DOM-элемент компонента должен иметь класс с именем блока, даже если у блока пока нет собственных стилей.
3. Имена записываются латиницей.
4. Блоки и элементы называются в `PascalCase`: `ButtonWithIcon`, `Icon`, `LoadingIndicator`.
5. Имена модификаторов и их значения записываются в `camelCase`: `fullWidth`, `size`, `extraSmall`.
6. Имя элемента отделяется от имени блока одним дефисом `-`.
7. Имя модификатора и его значение отделяются одним подчёркиванием `_`.
8. Класс модификатора добавляется вместе с основным классом блока или элемента, а не заменяет его.

## Формат имён

| Описание                              | Формат                                    | Пример                               |
| ------------------------------------- | ----------------------------------------- | ------------------------------------ |
| Блок                                  | `BlockName`                               | `ButtonBase`                         |
| Блок с булевым модификатором          | `BlockName_modName`                       | `ButtonBase_fullWidth`               |
| Блок с модификатором со значением     | `BlockName_modName_modVal`                | `ButtonIcon_size_m`                  |
| Элемент                               | `BlockName-ElemName`                      | `ButtonWithIcon-Icon`                |
| Элемент с булевым модификатором       | `BlockName-ElemName_modName`              | `ButtonWithIcon-Icon_hidden`         |
| Элемент с модификатором со значением  | `BlockName-ElemName_modName_modVal`       | `ButtonWithIcon-Icon_size_m`         |
| Составное имя элемента                | `BlockName-FirstSecond`                   | `ButtonWithIcon-LoadingIndicator`    |
| Составное имя и значение модификатора | `BlockName_modFirstSecond_valFirstSecond` | `ButtonWithIcon_iconSize_extraSmall` |

## Как читать имя класса

В классе `ButtonWithIcon-Icon_size_m`:

- `ButtonWithIcon` — блок;
- `Icon` — элемент блока, отделённый дефисом;
- `size` — имя модификатора, отделённое подчёркиванием;
- `m` — значение модификатора, также отделённое подчёркиванием.

У булевого модификатора значения нет: `ButtonBase_fullWidth`. Класс присутствует, когда признак включён, и отсутствует, когда выключен.

## Пример разметки

```html
<button class="ButtonWithIcon ButtonWithIcon_size_m">
  <span class="ButtonWithIcon-Icon ButtonWithIcon-Icon_size_m"></span>
  <span class="ButtonWithIcon-Label">Загрузить данные</span>
</button>
```

Вложенность DOM не добавляет уровней к имени элемента. Например, иконка внутри обёртки `ButtonWithIcon-Content` по-прежнему называется `ButtonWithIcon-Icon`.

## Пример SCSS

```scss
.ButtonWithIcon {
  display: inline-flex;

  &_size_m {
    gap: 8px;
  }
}

.ButtonWithIcon-Icon {
  display: inline-flex;

  &_hidden {
    visibility: hidden;
  }
}
```

## Утилитарные классы

Для утилит используется отдельная схема **`u-kebab-case`**: префикс `u-`, строчные латинские буквы и дефисы между словами.

Утилиты не являются элементами компонентов и не требуют отдельного класса блока. Они задают отдельное свойство или готовый набор свойств, например стиль типографики.

| Назначение          | Пример                                         |
| ------------------- | ---------------------------------------------- |
| Верхний регистр     | `u-uppercase`                                  |
| Выравнивание текста | `u-text-left`, `u-text-center`, `u-text-right` |
| Типографика кнопки  | `u-typo-button-l`, `u-typo-button-m`           |
| Типографика подписи | `u-typo-label-m`                               |
| Типографика отчёта  | `u-typo-report-body-accent`                    |

```html
<button class="ButtonBase ButtonBase_variant_accent">
  <span class="u-typo-button-l u-uppercase">Сохранить</span>
</button>
```

Новые утилиты определены в `src/app/styles/utilities/_typography.scss`. Старые классы из `src/app/styles/typography.css` сохраняются для прежнего интерфейса.

## Переход с прежней схемы

Для элементов разделитель `_` заменяется на `-`:

- `ButtonWithIcon_Icon` → `ButtonWithIcon-Icon`;
- `ButtonWithIcon_Content` → `ButtonWithIcon-Content`;
- `ButtonWithIcon_Icon_size_m` → `ButtonWithIcon-Icon_size_m`.

Имена блоков и разделители модификаторов сохраняются: `ButtonBase`, `ButtonBase_fullWidth`, `ButtonIcon_size_m`.
