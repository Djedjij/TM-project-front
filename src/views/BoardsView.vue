<script setup lang="ts">
import BaseStub from '@/components/base/stub/BaseStub.vue'
import BoardCard from '@/components/board/boardCard/BoardCard.vue'
import { useBoardsStore } from '@/stores/boards'
import { onMounted, ref, computed } from 'vue'

const store = useBoardsStore()

const boards = computed(() => store.boards)
const isLoading = computed(() => store.isLoading)

onMounted(() => store.loadBoards())

const openModal = () => {
  createBoardModalOpen.value = true
}

const createBoardModalOpen = ref(false)
</script>

<template>
  <div class="wrapper">
    <div class="boards-empty" v-if="!boards.length && !isLoading">
      <el-row>
        <el-col :sm="24">
          <BaseStub description="Созданных досок не найдено. Создайте новую доску" />
          <BaseButton text="Создать новую доску" @click="openModal" />
        </el-col>
      </el-row>
    </div>
    <div v-loading="store.isLoading" v-else class="content">
      <div class="content-actions">
        <BaseButton text="Создать новую доску" @click="openModal" />
      </div>
      <div class="boards">
        <BoardCard v-for="board in boards" :key="board.id" :board="board" />
      </div>
    </div>
  </div>
  <CreateBoardModal v-model="createBoardModalOpen" />
</template>

<style lang="scss" scoped>
@use '@/assets/main.scss' as *;
.wrapper {
  width: 100%;
  display: flex;
}
.boards-empty {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.content {
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.content-actions {
  display: flex;
  gap: 20px;
}

.boards {
  display: flex;
  gap: 24px;
  align-items: center;
}
</style>
