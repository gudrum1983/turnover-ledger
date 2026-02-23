import { ruReport } from './locales/ru/report'
import { ruUi } from './locales/ru/ui'

// Базовый (эталонный) словарь приложения.
// Мы используем именно русский словарь как "источник структуры":
// какие есть разделы, вложенные объекты и ключи переводов.
export const baseLocaleMessages = {
  report: ruReport,
  ui: ruUi,
} as const

// Полная структура словаря (с текущими русскими строками).
export type I18nBaseMessagesSchema = typeof baseLocaleMessages

// Тип для словарей других локалей:
// структура должна совпадать с русской, но значения могут быть любыми строками.
//
// Пример:
// - в ru: { ui: { app: { title: 'Заголовок' } } }
// - в en должно быть: { ui: { app: { title: 'Title' } } }
// Если какой-то ключ пропущен или вложенность отличается — TypeScript покажет ошибку.
export type I18nLocaleMessages = ReplaceLeafStringsWithString<I18nBaseMessagesSchema>

type ReplaceLeafStringsWithString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
      ? ReplaceLeafStringsWithString<T[K]>
      : never
}

// Склеивает части пути в формат "a.b.c".
// Нужен для генерации ключей перевода вида "ui.reportTable.addRow".
type JoinPath<Prefix extends string, Key extends string> = Prefix extends '' ? Key : `${Prefix}.${Key}`

// Рекурсивно обходит объект и собирает пути только до "листовых" строковых значений.
//
// Пример:
// {
//   ui: {
//     app: { title: '...' },
//     locale: { ru: '...' }
//   }
// }
//
// Превратится в union:
// "ui.app.title" | "ui.locale.ru"
type StringValuePaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? JoinPath<Prefix, K>
    : T[K] extends Record<string, unknown>
      ? StringValuePaths<T[K], JoinPath<Prefix, K>>
      : never
}[keyof T & string]

// Все допустимые ключи для функции перевода (например, `t(...)`).
// Благодаря этому IDE подсказывает ключи и ловит опечатки.
export type I18nMessageKey = StringValuePaths<I18nBaseMessagesSchema>
