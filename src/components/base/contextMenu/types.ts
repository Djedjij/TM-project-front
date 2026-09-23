import type { Component } from 'vue'

export type TContextMenuItem = {
  /** Уникальный ключ пункта, возвращается в событии select */
  key: string
  /** Подпись пункта меню */
  label: string
  /** Иконка Element Plus (@element-plus/icons-vue) */
  icon?: Component
  /** Красный акцент для разрушительных действий */
  danger?: boolean
}

export type TBaseContextMenuProps = {
  modelValue: boolean
  /** Координата открытия по оси X (event.clientX) */
  x: number
  /** Координата открытия по оси Y (event.clientY) */
  y: number
  items: TContextMenuItem[]
}
