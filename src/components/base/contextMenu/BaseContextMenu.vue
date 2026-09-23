<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { TBaseContextMenuProps } from './types'

/** Отступ от краёв окна, чтобы меню не прилипало к границе */
const VIEWPORT_GAP = 8

const props = withDefaults(defineProps<TBaseContextMenuProps>(), {
  modelValue: false,
  x: 0,
  y: 0,
  items: () => [],
})

const emit = defineEmits(['update:modelValue', 'select'])

const menuRef = ref<HTMLElement | null>(null)
const position = ref({ left: 0, top: 0 })

/** Меню рендерится в body, поэтому координаты ограничиваем размерами окна */
const updatePosition = () => {
  const menu = menuRef.value
  if (!menu) return

  const { width, height } = menu.getBoundingClientRect()
  const maxLeft = Math.max(VIEWPORT_GAP, window.innerWidth - width - VIEWPORT_GAP)
  const maxTop = Math.max(VIEWPORT_GAP, window.innerHeight - height - VIEWPORT_GAP)

  position.value = {
    left: Math.min(Math.max(props.x, VIEWPORT_GAP), maxLeft),
    top: Math.min(Math.max(props.y, VIEWPORT_GAP), maxTop),
  }
}

const close = () => emit('update:modelValue', false)

const onSelect = (key: string) => {
  emit('select', key)
  close()
}

const onPointerDownOutside = (event: PointerEvent) => {
  const target = event.target as Node | null

  if (target && menuRef.value?.contains(target)) return

  close()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

const removeListeners = () => {
  document.removeEventListener('pointerdown', onPointerDownOutside, true)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', close)
  window.removeEventListener('scroll', close, true)
}

const addListeners = () => {
  removeListeners()
  document.addEventListener('pointerdown', onPointerDownOutside, true)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', close)
  // Скролл слушаем на фазе перехвата: меню привязано к координатам окна, а не к контейнеру
  window.addEventListener('scroll', close, true)
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (!isOpen) {
      removeListeners()
      return
    }

    position.value = { left: props.x, top: props.y }
    addListeners()

    await nextTick()
    updatePosition()
  },
)

onBeforeUnmount(removeListeners)
</script>

<template>
  <Teleport to="body">
    <Transition name="context-menu">
      <div
        v-if="modelValue"
        ref="menuRef"
        class="context-menu"
        role="menu"
        :style="{ left: `${position.left}px`, top: `${position.top}px` }"
      >
        <button
          v-for="item in items"
          :key="item.key"
          class="context-menu__item"
          :class="{ 'context-menu__item_danger': item.danger }"
          type="button"
          role="menuitem"
          @click="onSelect(item.key)"
        >
          <el-icon v-if="item.icon" class="context-menu__icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="context-menu__label">{{ item.label }}</span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 184px;
  padding: 6px;
  background-color: var(--app-surface-raised);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);
  box-shadow: var(--app-shadow-lg);
  transition:
    background-color var(--app-transition-slow),
    border-color var(--app-transition-slow);

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 10px;
    font: inherit;
    font-size: 14px;
    color: var(--el-text-color-regular);
    text-align: left;
    white-space: nowrap;
    background-color: transparent;
    border: none;
    border-radius: var(--app-radius-sm);
    cursor: pointer;
    transition:
      color var(--app-transition),
      background-color var(--app-transition);

    &:hover,
    &:focus-visible {
      color: var(--el-text-color-primary);
      background-color: var(--app-surface-muted);
      outline: none;
    }

    &_danger {
      color: var(--el-color-danger);

      &:hover,
      &:focus-visible {
        color: var(--el-color-danger);
        background-color: var(--el-color-danger-light-9);
      }
    }
  }

  &__icon {
    flex: none;
    font-size: 16px;
  }

  &__label {
    font-weight: 500;
  }
}

.context-menu-enter-active,
.context-menu-leave-active {
  transition:
    opacity var(--app-transition),
    transform var(--app-transition);
}

.context-menu-enter-from,
.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}
</style>
