<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { TColumnCreateRequest } from '@/api/columns/types'
import { useColumnsStore } from '@/stores/columns'

const props = defineProps<{
  modelValue: boolean
  boardId: string
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { createNewColumn } = useColumnsStore()
const form = reactive<TColumnCreateRequest>({
  title: '',
  board_id: props.boardId,
  status: '',
})

const onSubmit = async () => {
  await createNewColumn(form, props.boardId)
  dialogVisible.value = false
}
</script>

<template>
  <BaseModal v-model="dialogVisible" title="Новая Колонка">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="Название столбца">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Статус">
        <el-input v-model="form.status" />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form>
  </BaseModal>
</template>
