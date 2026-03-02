<template>
  <el-card class="wrapper">
    <template #header>
      <div class="wrapper_header">
        <router-link :to="`/boards/${board.id}`">{{ board.title }}</router-link>
        <base-tag :type="board.status" :text="boardStatusTitle" />
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { EBoardStatus, TBoard } from '@/api/boards/types'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import { computed } from 'vue'

const props = defineProps<{
  board: TBoard
}>()

const boardStatusTitle = computed(() => {
  switch (props.board.status) {
    case EBoardStatus.active:
      return 'Активный'
    case EBoardStatus.paused:
      return 'На паузе'
    default:
      return 'Нет статуса'
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/main.scss' as *;

.wrapper {
  width: 350px;
  max-width: 350px;
  height: 150px;
  display: flex;
  border-radius: 4px;

  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
