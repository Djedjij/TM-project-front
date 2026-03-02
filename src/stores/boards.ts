import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TBoard, TBoardCreateRequest } from '@/api/boards/types'
import { createBoard, getBoards, getBoard } from '@/api/boards'
import { P } from 'vue-router/dist/index-DFCq6eJK.js'

export const useBoardsStore = defineStore('boards', () => {
  const boards = ref<TBoard[]>([])
  const isLoading = ref(false)
  const board = ref<TBoard | null>(null)

  const loadBoards = async () => {
    try {
      isLoading.value = true
      const res = await getBoards()
      if (res.data) {
        boards.value = res.data
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const createNewBoard = async (data: TBoardCreateRequest) => {
    try {
      isLoading.value = true
      const res = await createBoard(data)
      if (res) {
        loadBoards()
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const loadBoard = async (id: string) => {
    try {
      isLoading.value = true
      const res = await getBoard(id)
      if (res.data) {
        board.value = res.data
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    boards,
    board,
    isLoading,
    loadBoards,
    createNewBoard,
    loadBoard,
  }
})
