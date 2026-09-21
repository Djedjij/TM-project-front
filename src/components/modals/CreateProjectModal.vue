<script lang="ts" setup>
import { computed, reactive, watch } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import toast from '@/components/base/toast/toast'
import { TProjectCreateRequest } from '@/api/projects/types'
import { useProjectsStore } from '@/stores/projects'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { createNewProject } = useProjectsStore()

const form = reactive<TProjectCreateRequest>({
  title: '',
  description: '',
})

watch(dialogVisible, (isOpen) => {
  if (isOpen) {
    form.title = ''
    form.description = ''
  }
})

const onSubmit = async () => {
  if (!form.title.trim()) {
    toast.error('Укажите название проекта')
    return
  }

  const createdProject = await createNewProject({
    title: form.title.trim(),
    description: form.description.trim(),
  })

  if (createdProject) {
    dialogVisible.value = false
  }
}
</script>

<template>
  <BaseModal v-model="dialogVisible" title="Новый проект">
    <el-form :model="form" label-width="auto" class="form">
      <el-form-item label="Название проекта">
        <el-input v-model="form.title" placeholder="Например: Task Manager" />
      </el-form-item>
      <el-form-item label="Описание">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="Кратко о проекте"
        />
      </el-form-item>
      <div class="form__actions">
        <BaseButton type="primary" text="Создать" @click="onSubmit" />
        <BaseButton type="default" text="Отменить" @click="dialogVisible = false" />
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
