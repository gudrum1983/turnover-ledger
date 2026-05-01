import { ruUi } from './locales/ru/ui'

export const baseLocaleMessages = {
  ui: ruUi,
} as const

// Полная структура словаря (с текущими русскими строками).
export type I18nBaseMessagesSchema = typeof baseLocaleMessages

export type I18nLocaleMessages = ReplaceLeafStringsWithString<I18nBaseMessagesSchema>

type ReplaceLeafStringsWithString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
      ? ReplaceLeafStringsWithString<T[K]>
      : never
}

type JoinPath<Prefix extends string, Key extends string> = Prefix extends '' ? Key : `${Prefix}.${Key}`

type StringValuePaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? JoinPath<Prefix, K>
    : T[K] extends Record<string, unknown>
      ? StringValuePaths<T[K], JoinPath<Prefix, K>>
      : never
}[keyof T & string]

export type I18nMessageKey = StringValuePaths<I18nBaseMessagesSchema>
