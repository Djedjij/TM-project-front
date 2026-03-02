<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { TBoardCreateRequest } from '@/api/boards/types'
import { useBoardsStore } from '@/stores/boards'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { createNewBoard } = useBoardsStore()
const form = reactive<TBoardCreateRequest>({
  title: '',
  description: '',
})

const onSubmit = async () => {
  await createNewBoard(form)
  dialogVisible.value = false
}
</script>

<template>
  <BaseModal v-model="dialogVisible" title="Новая Доска">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="Название доски">
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
