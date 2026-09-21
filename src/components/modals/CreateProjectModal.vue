<script lang="ts" setup>
import { computed, reactive } from 'vue'
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

const onSubmit = async () => {
  await createNewProject(form)
  dialogVisible.value = false
}
</script>

<template>
  <BaseModal v-model="dialogVisible" title="Новый Проект">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="Название проекта">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Описание">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form>
  </BaseModal>
</template>
