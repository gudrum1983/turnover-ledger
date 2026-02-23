// Row labels (full / short):
// EN: Goods / Services / Total → Gds. / Srv. / Total
// SR: Roba / Usluge / Ukupno → Rob. / Usl. / Uk.
// RU: Товары / Услуги / Итого → Тов. / Усл. / Итог

// SR: Svega (Sve.) — row subtotal, Ukupno (Uk.) — table total
// RU: Сумма (Сум.) — row subtotal, Итого (Итог) — table total
// EN: Subtotal (Sub.) — row subtotal, Total — table total

/*todo - чем satisfies отличается от Record-аннотации
*
* https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html
*
* • Да, вот короткий пример на твоем кейсе. С satisfies можно вытащить union из конкретных строк:

*
*
import { KPO_DICTIONARY } from '@/shared/constants/kpoDictionary.ts'
import type { HeaderField } from '@/shared/constants/reportFields.ts'

type HeaderRu = (typeof KPO_DICTIONARY.header)[HeaderField]['ru']
// HeaderRu = 'ПИБ' | 'Налогоплательщик (имя и фамилия)' | 'Фирма' | ...

То же для title или table:

import type { TitleField } from '@/shared/constants/reportFields.ts'

type TitleEn = (typeof KPO_DICTIONARY.title)[TitleField]['en']
// TitleEn = 'Book of Realized Turnover' | '(Lump-Sum Taxation)'

Если бы KPO_DICTIONARY был аннотирован как Record<..., DictionaryEntry>, то HeaderRu стало бы просто string — литералы потерялись бы.
*  */