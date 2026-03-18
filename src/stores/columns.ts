import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TColumn, TColumnCreateRequest } from '@/api/columns/types'
import { createColumn, getColumns, getColumn } from '@/api/columns'

export const useColumnsStore = defineStore('columns', () => {
  const columns = ref<TColumn[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadColumns = async (boardId: string) => {
    try {
      isLoading.value = true
      const res = await getColumns()
      if (res.data) {
        columns.value = res.data
      }
    } catch (e: unknown) {
      console.log(e)
      if (typeof e === 'string') {
        error.value = e
      } else {
        error.value = 'Ошибка при загрузке колонок'
      }
    } finally {
      isLoading.value = false
    }
  }

  const createNewColumn = async (data: TColumnCreateRequest, boardId: string) => {
    try {
      isLoading.value = true
      const res = await createColumn(data)
      if (res) {
        loadColumns(boardId)
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    columns,
    isLoading,
    error,
    loadColumns,
    createNewColumn,
  }
})
