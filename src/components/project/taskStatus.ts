import { ETaskStatus } from '@/api/tasks/types'

/** Порядок колонок на доске задач */
export const TASK_STATUSES: ETaskStatus[] = [
  ETaskStatus.created,
  ETaskStatus.in_progress,
  ETaskStatus.done,
  ETaskStatus.cancelled,
]

/** Заголовки статусов для доски и карточки задачи */
export const TASK_STATUS_TITLES: Record<ETaskStatus, string> = {
  [ETaskStatus.created]: 'Новые',
  [ETaskStatus.in_progress]: 'В работе',
  [ETaskStatus.done]: 'Выполнены',
  [ETaskStatus.cancelled]: 'Отменены',
}

/** Типы тегов статуса (BaseTag) */
export const TASK_STATUS_TYPES: Record<ETaskStatus, string> = {
  [ETaskStatus.created]: 'info',
  [ETaskStatus.in_progress]: 'primary',
  [ETaskStatus.done]: 'success',
  [ETaskStatus.cancelled]: 'danger',
}

/** Подсказки для пустых колонок */
export const TASK_STATUS_HINTS: Record<ETaskStatus, string> = {
  [ETaskStatus.created]: 'Здесь оказываются только что созданные задачи',
  [ETaskStatus.in_progress]: 'Перетащите задачу, чтобы взять её в работу',
  [ETaskStatus.done]: 'Перетащите сюда завершённые задачи',
  [ETaskStatus.cancelled]: 'Перетащите сюда задачи, которые больше не нужно делать',
}
