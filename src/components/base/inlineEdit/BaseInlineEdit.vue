<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Check, Close, EditPen, Loading } from '@element-plus/icons-vue'
import { TBaseInlineEditProps } from './types'

const props = withDefaults(defineProps<TBaseInlineEditProps>(), {
  label: '',
  hint: 'Нажмите, чтобы изменить',
  multiline: false,
  loading: false,
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const editorRef = ref<HTMLElement | null>(null)

const startEditing = () => {
  emit('update:modelValue', true)
}

const cancelEditing = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

const saveEditing = () => {
  if (props.loading) return

  emit('save')
}

/** Enter сохраняет однострочное поле, Ctrl + Enter — многострочное */
const onEnter = (event: KeyboardEvent) => {
  if (props.multiline && !event.ctrlKey && !event.metaKey) return

  event.preventDefault()
  saveEditing()
}

/**
 * Переносим фокус в редактор: текстовые поля — сразу в режим ввода,
 * select и date picker дополнительно раскрывают свой поповер по клику.
 */
const focusEditor = async () => {
  await nextTick()

  const field = editorRef.value?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    'input, textarea',
  )

  if (!field) return

  field.focus()

  if (field.readOnly) {
    const trigger = field.closest<HTMLElement>('.el-select__wrapper, .el-input__wrapper') ?? field
    trigger.click()
    return
  }

  const end = field.value.length
  field.setSelectionRange(end, end)
}

watch(
  () => props.modelValue,
  (isEditing) => {
    if (isEditing) focusEditor()
  },
)
</script>

<template>
  <div class="inline-edit" :class="{ 'inline-edit_active': modelValue }">
    <div class="inline-edit__header">
      <span v-if="label" class="inline-edit__label">{{ label }}</span>
      <span v-if="modelValue && multiline" class="inline-edit__hint">
        Ctrl + Enter — сохранить, Esc — отмена
      </span>

      <div class="inline-edit__tools">
        <template v-if="modelValue">
          <button
            class="inline-edit__tool"
            type="button"
            aria-label="Сохранить"
            :disabled="loading"
            @mousedown.prevent
            @click="saveEditing"
          >
            <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
            <el-icon v-else><Check /></el-icon>
          </button>
          <button
            class="inline-edit__tool"
            type="button"
            aria-label="Отменить"
            @mousedown.prevent
            @click="cancelEditing"
          >
            <el-icon><Close /></el-icon>
          </button>
        </template>

        <el-tooltip v-else :content="hint" placement="top">
          <button class="inline-edit__tool" type="button" :aria-label="hint" @click="startEditing">
            <el-icon><EditPen /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </div>

    <div
      v-if="!modelValue"
      class="inline-edit__view"
      role="button"
      tabindex="0"
      @click="startEditing"
      @keydown.enter.prevent="startEditing"
      @keydown.space.prevent="startEditing"
    >
      <slot />
    </div>

    <div
      v-else
      ref="editorRef"
      class="inline-edit__editor"
      @keydown.enter="onEnter"
      @keydown.esc.stop.prevent="cancelEditing"
    >
      <slot name="editor" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.inline-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 26px;
  }

  &__label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--el-text-color-secondary);
  }

  &__hint {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    opacity: 0.85;
  }

  &__tools {
    display: flex;
    gap: 2px;
    margin-left: auto;
    opacity: 0;
    transition: opacity var(--app-transition);
  }

  &:hover &__tools,
  &_active &__tools,
  &:focus-within &__tools {
    opacity: 1;
  }

  &__tool {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    font-size: 15px;
    color: var(--el-text-color-secondary);
    background-color: transparent;
    border: none;
    border-radius: var(--app-radius-sm);
    cursor: pointer;
    transition:
      color var(--app-transition),
      background-color var(--app-transition);

    &:hover,
    &:focus-visible {
      color: var(--el-color-primary);
      background-color: var(--app-surface-muted);
      outline: none;
    }

    &:disabled {
      cursor: default;
      opacity: 0.6;
    }
  }

  &__view {
    border-radius: var(--app-radius-sm);
  }

  &__editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
