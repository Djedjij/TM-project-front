import { ElMessageBox } from 'element-plus'

/**
 * Спрашивает подтверждение перед удалением задачи.
 * Возвращает true, если пользователь подтвердил действие.
 */
export const confirmTaskDelete = async (title: string) => {
  try {
    await ElMessageBox.confirm(
      `Задача «${title}» будет удалена без возможности восстановления`,
      'Удалить задачу?',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      },
    )
    return true
  } catch {
    // Пользователь отказался от удаления
    return false
  }
}
