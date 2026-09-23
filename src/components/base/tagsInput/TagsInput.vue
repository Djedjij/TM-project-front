<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import toast from '@/components/base/toast/toast'
import { TTagsInputProps } from './types'

const props = withDefaults(defineProps<TTagsInputProps>(), {
  modelValue: () => [],
  placeholder: 'Введите тег и нажмите Enter',
  maxTags: 20,
  maxLength: 30,
  disabled: false,
})

const emit = defineEmits(['update:modelValue'])

const draft = ref('')

const addTag = () => {
  if (props.disabled) return

  // Пользователь может ввести тег как с решёткой, так и без неё
  const value = draft.value.trim().replace(/^#/, '')

  if (!value) return

  if (value.length > props.maxLength) {
    toast.error(`Тег не длиннее ${props.maxLength} символов`)
    return
  }

  if (props.modelValue.includes(value)) {
    toast.error('Такой тег уже добавлен')
    return
  }

  if (props.modelValue.length >= props.maxTags) {
    toast.error(`Можно добавить не больше ${props.maxTags} тегов`)
    return
  }

  emit('update:modelValue', [...props.modelValue, value])
  draft.value = ''
}

const removeTag = (tag: string) => {
  if (props.disabled) return

  emit(
    'update:modelValue',
    props.modelValue.filter((item) => item !== tag),
  )
}
</script>

<template>
  <div class="tags">
    <div v-if="modelValue.length" class="tags__list">
      <el-tag
        v-for="tag in modelValue"
        :key="tag"
        class="tags__tag"
        type="info"
        :closable="!disabled"
        @close="removeTag(tag)"
      >
        #{{ tag }}
      </el-tag>
    </div>

    <div class="tags__row">
      <el-input
        v-model="draft"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxLength"
        @keyup.enter="addTag"
      />
      <BaseButton type="default" text="Добавить" :disabled="disabled" @click="addTag" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tags {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__list {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__tag {
    padding: 3px 10px;
    font-weight: 500;
    border-radius: var(--app-radius-pill);
  }

  &__row {
    display: flex;
    gap: 8px;
  }
}
</style>
