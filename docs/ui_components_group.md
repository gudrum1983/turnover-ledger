• Коротко про основания и практики, на которых я опирался:

1. В FSD слой shared — это фундамент без бизнес-логики; внутри него допустимы «сегменты», и их имена должны описывать
   назначение, а не сущность. То есть в shared/ui уместны группы по назначению UI, а не по фичам. (
   feature-sliced.github.io (https://feature-sliced.github.io/documentation/docs/reference/
   layers?utm_source=openai))
2. Большие дизайн‑системы группируют компоненты по типам взаимодействия: ввод данных, отображение данных, навигация,
   обратная связь, поверхности/контейнеры. Это общепринятая таксономия, не специфичная для FSD. (
   ng.ant.design (https://ng.ant.design/components/overview/en?utm_source=openai))
3. Внутри «ввода данных» отдельной подкатегорией считаются selection controls (селекты, листы выбора) — это не кнопки,
   даже если открываются по клику. Поэтому BaseListBox логичнее держать в forms/ или inputs/. (
   carbondesignsystem.com (https://carbondesignsystem.com/components/form/usage?
   utm_source=openai))
4. «Модальные окна/диалоги» относятся к обратной связи/оверлеям, а не к формам или кнопкам. Поэтому BaseModal в
   overlays/ или feedback/. (m1.material.io (https://m1.material.io/components/dialogs.html?utm_source=openai))
5. BasePaper и BaseTag — это «поверхности»/«data display» (контейнеры и элементы отображения), что подтверждается
   категориями дизайн‑систем. (eds.equinor.com (https://eds.equinor.com/docs/components/?utm_source=openai))

Отсюда и названия папок:

- buttons/ — компоненты действия и инициирования (кнопки).
- forms/ или inputs/ — ввод/выбор данных (поля, селекты, листбоксы).
- overlays/ или feedback/ — модалки, тосты, диалоги.
- display/ или surfaces/ — контейнеры, теги, визуальные блоки.
- icons/ отдельно.

Если хочешь следовать более «каноничной» терминологии, бери названия из систем:

- data-entry (ввод)
- data-display (отображение)
- feedback (обратная связь)
- navigation
- surfaces (контейнеры/поверхности)

Могу предложить конкретный нейминг под твой текущий набор, если скажешь, какие категории тебе ближе: «form/input» или
«data-entry».