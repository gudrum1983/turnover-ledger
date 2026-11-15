import type { Component } from 'vue'

export type ActionMenuItem = {
  /** Значение, которое придёт в событии select */
  value: string
  /** Текст пункта меню */
  label: string
  /** Иконка пункта (компонент из shared/ui-v2/icons) */
  icon?: Component
  /** Опасное действие (например, удаление) — выделяется цветом */
  danger?: boolean
}
