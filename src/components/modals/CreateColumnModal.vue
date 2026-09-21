<script lang="ts" setup>
import { computed, reactive } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import { TColumnCreateRequest } from '@/api/columns/types'
import { useColumnsStore } from '@/stores/columns'

const props = defineProps<{
  modelValue: boolean
  projectId: string
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { createNewColumn } = useColumnsStore()
const form = reactive<TColumnCreateRequest>({
  title: '',
  project_id: props.projectId,
  status: '',
})

const onSubmit = async () => {
  await createNewColumn(form, props.projectId)
  dialogVisible.value = false
}
</script>

<template>
  <BaseModal v-model="dialogVisible" title="Новая колонка">
    <el-form :model="form" label-width="auto" class="form">
      <el-form-item label="Название столбца">
        <el-input v-model="form.title" placeholder="Например: В работе" />
      </el-form-item>
      <el-form-item label="Статус">
        <el-input v-model="form.status" placeholder="in_progress" />
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
