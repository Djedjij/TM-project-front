<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { TTaskCreateRequest } from '@/api/tasks/types'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps<{
  modelValue: boolean
  boardId: string
}>()

const emit = defineEmits(['update:modelValue', 'close'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { createNewTask } = useTasksStore()
const form = reactive<TTaskCreateRequest>({
  title: '',
  description: '',
  story_points: 0,
  board_id: props.boardId,
  column: 'backlog',
})

const onSubmit = async () => {
  await createNewTask(form)
  dialogVisible.value = false
}
</script>

<template>
  <BaseModal v-model="dialogVisible" title="Новая Задача">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="Название задачи">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Описание">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="Story points">
        <el-input v-model="form.story_points" />
      </el-form-item>
      <BaseButton type="primary" @click="onSubmit" text="Создать" />
      <BaseButton type="secondary" @click="$emit('close')" text="Отменить" />
    </el-form>
  </BaseModal>
</template>
