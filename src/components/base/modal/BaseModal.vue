<script lang="ts" setup>
import { computed } from 'vue'
import { TBaseModalProps } from './types'

const props = withDefaults(defineProps<TBaseModalProps>(), {
  width: '560px',
})
const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    class="app-dialog"
    align-center
    destroy-on-close
  >
    <slot />
  </el-dialog>
</template>

<style lang="scss">
.el-dialog.app-dialog {
  --el-dialog-padding-primary: 20px;
  --el-dialog-border-radius: var(--app-radius);
  --el-dialog-bg-color: var(--app-surface-raised);
  --el-dialog-box-shadow: var(--app-shadow-lg);

  border: 1px solid var(--app-border);

  .el-dialog__header {
    padding-bottom: 16px;
    margin-right: 0;
    border-bottom: 1px solid var(--app-border);
  }

  .el-dialog__title {
    font-size: 18px;
    font-weight: 600;
  }

  .el-dialog__body {
    padding-top: 20px;
  }

  .el-dialog__headerbtn {
    top: 4px;
    right: 4px;
  }
}

@media (max-width: 640px) {
  /* Ширина задаётся инлайн-стилем Element Plus, поэтому переопределяем через !important */
  .el-dialog.app-dialog {
    --el-dialog-width: calc(100vw - 32px) !important;
  }
}
</style>
