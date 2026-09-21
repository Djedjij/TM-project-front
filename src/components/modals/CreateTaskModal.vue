<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import toast from '@/components/base/toast/toast'
import { TTaskCreateRequest } from '@/api/tasks/types'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps<{
  modelValue: boolean
  projectId: string
}>()

const emit = defineEmits(['update:modelValue', 'close'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { createNewTask } = useTasksStore()

const createEmptyForm = (): TTaskCreateRequest => ({
  title: '',
  description: '',
  dueAt: null,
})

const form = reactive<TTaskCreateRequest>(createEmptyForm())

watch(dialogVisible, (isOpen) => {
  if (isOpen) {
    Object.assign(form, createEmptyForm())
  }
})

const onSubmit = async () => {
  if (!form.title.trim()) {
    toast.error('Укажите название задачи')
    return
  }

  const createdTask = await createNewTask({
    title: form.title.trim(),
    description: form.description?.trim() || null,
    dueAt: form.dueAt || null,
    projectId: props.projectId,
  })

  if (createdTask) {
    dialogVisible.value = false
  }
}
</script>

<template>
  <BaseModal v-model="dialogVisible" title="Новая задача">
    <el-form :model="form" label-width="auto" class="form">
      <el-form-item label="Название задачи">
        <el-input v-model="form.title" placeholder="Например: Сверстать страницу проекта" />
      </el-form-item>
      <el-form-item label="Описание">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="Что нужно сделать"
        />
      </el-form-item>
      <el-form-item label="Срок выполнения">
        <el-date-picker
          v-model="form.dueAt"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="Выберите дату"
        />
      </el-form-item>
      <div class="form__actions">
        <BaseButton type="primary" text="Создать" @click="onSubmit" />
        <BaseButton type="default" text="Отменить" @click="$emit('close')" />
      </div>
    </el-form>
  </BaseModal>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
