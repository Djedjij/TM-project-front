export type TBaseInlineEditProps = {
  /** Режим редактирования (v-model) */
  modelValue: boolean
  /** Подпись поля */
  label?: string
  /** Подсказка у иконки редактирования */
  hint?: string
  /** Многострочное поле: Enter переносит строку, сохраняет Ctrl + Enter */
  multiline?: boolean
  /** Идёт сохранение значения */
  loading?: boolean
}
