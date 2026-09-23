<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Delete } from '@element-plus/icons-vue'
import BaseInlineEdit from '@/components/base/inlineEdit/BaseInlineEdit.vue'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import TagsInput from '@/components/base/tagsInput/TagsInput.vue'
import toast from '@/components/base/toast/toast'
import {
  ETaskStatus,
  TASK_TAG_MAX_COUNT,
  TASK_TAG_MAX_LENGTH,
  TTask,
  TTaskUpdateRequest,
} from '@/api/tasks/types'
import { confirmTaskDelete } from '@/components/project/taskActions'
import {
  TASK_STATUSES,
  TASK_STATUS_TITLES,
  TASK_STATUS_TYPES,
} from '@/components/project/taskStatus'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps<{
  modelValue: boolean
  task: TTask | null
}>()

const emit = defineEmits(['update:modelValue', 'deleted'])

/** Поля задачи, которые редактируются прямо в карточке */
type TTaskField = 'title' | 'description' | 'due' | 'status'

const drawerVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { updateTaskData, updateTaskTags, updateTaskStatus, deleteTaskById } = useTasksStore()

const editing = reactive<Record<TTaskField, boolean>>({
  title: false,
  description: false,
  due: false,
  status: false,
})

const saving = reactive<Record<TTaskField, boolean>>({
  title: false,
  description: false,
  due: false,
  status: false,
})

/** Черновики значений для инлайн-редакторов */
const draft = reactive({
  title: '',
  description: '',
  dueAt: null as string | null,
  status: ETaskStatus.created,
})

const isTagsSaving = ref(false)

const formatDate = (value?: string | null) => (value ? dayjs(value).format('DD.MM.YYYY') : '')
const toInputDate = (value?: string | null) => (value ? dayjs(value).format('YYYY-MM-DD') : null)

const status = computed(() => props.task?.status ?? ETaskStatus.created)
const statusTitle = computed(() => TASK_STATUS_TITLES[status.value])
const statusType = computed(() => TASK_STATUS_TYPES[status.value])

const tags = computed(() => props.task?.tag ?? [])
const description = computed(() => props.task?.description?.trim() || 'Описание не заполнено')

const dueAt = computed(() => formatDate(props.task?.dueAt))
const dueTitle = computed(() => (dueAt.value ? `до ${dueAt.value}` : ''))
const isOverdue = computed(
  () => !!props.task?.dueAt && dayjs(props.task.dueAt).isBefore(dayjs(), 'day'),
)

const createdAt = computed(() => formatDate(props.task?.createdAt))
const updatedAt = computed(() => formatDate(props.task?.updatedAt))

/** Пока открыт хотя бы один редактор, Esc отменяет правку, а не закрывает панель */
const isEditing = computed(() => Object.values(editing).some(Boolean))

const closeEditors = () => {
  ;(Object.keys(editing) as TTaskField[]).forEach((field) => {
    editing[field] = false
  })
}

/** Актуализируем черновики по текущей задаче */
const syncDrafts = () => {
  draft.title = props.task?.title ?? ''
  draft.description = props.task?.description ?? ''
  draft.dueAt = toInputDate(props.task?.dueAt)
  draft.status = status.value
}

// При открытии панели (или смене задачи) выходим из режимов редактирования
watch(
  () => [props.modelValue, props.task?.id] as const,
  ([isOpen]) => {
    if (!isOpen) return

    closeEditors()
    syncDrafts()
  },
  { immediate: true },
)

/** Открываем одно поле: черновики берём из актуальной задачи, остальные редакторы закрываем */
const onEditToggle = (field: TTaskField, value: boolean) => {
  if (!value) {
    editing[field] = false
    return
  }

  syncDrafts()
  closeEditors()
  editing[field] = true
}

const cancelEditing = (field: TTaskField) => {
  editing[field] = false
  syncDrafts()
}

/** PUT передаёт задачу целиком, поэтому к изменяемому полю добавляем актуальные значения остальных */
const saveFields = async (patch: TTaskUpdateRequest) => {
  const task = props.task
  if (!task) return false

  const updated = await updateTaskData(task.id, {
    title: task.title,
    description: task.description,
    dueAt: task.dueAt,
    ...patch,
  })

  return !!updated
}

const saveTitle = async () => {
  const task = props.task
  if (!task) return

  const title = draft.title.trim()

  if (!title) {
    toast.error('Укажите название задачи')
    return
  }

  if (title === task.title) {
    editing.title = false
    return
  }

  saving.title = true
  const isSaved = await saveFields({ title })
  saving.title = false

  if (isSaved) editing.title = false
}

const saveDescription = async () => {
  const task = props.task
  if (!task) return

  const description = draft.description.trim()

  if (description === (task.description ?? '')) {
    editing.description = false
    return
  }

  saving.description = true
  const isSaved = await saveFields({ description: description || null })
  saving.description = false

  if (isSaved) editing.description = false
}

const saveDue = async () => {
  const task = props.task
  if (!task) return

  if (draft.dueAt === toInputDate(task.dueAt)) {
    editing.due = false
    return
  }

  saving.due = true
  const isSaved = await saveFields({ dueAt: draft.dueAt || null })
  saving.due = false

  if (isSaved) {
    editing.due = false
  } else {
    syncDrafts()
  }
}

const saveStatus = async () => {
  const task = props.task
  if (!task) return

  if (draft.status === status.value) {
    editing.status = false
    return
  }

  saving.status = true
  const updated = await updateTaskStatus(task.id, draft.status)
  saving.status = false

  if (updated) {
    editing.status = false
  } else {
    syncDrafts()
  }
}

const onTagsChange = async (value: string[]) => {
  const task = props.task
  if (!task) return

  // Блокируем ввод на время запроса, иначе быстрые добавления перезапишут друг друга
  isTagsSaving.value = true
  await updateTaskTags(task.id, value)
  isTagsSaving.value = false
}

const onDelete = async () => {
  const task = props.task
  if (!task) return

  if (!(await confirmTaskDelete(task.title))) return

  const isDeleted = await deleteTaskById(task.id)

  if (isDeleted) {
    emit('deleted', task.id)
    drawerVisible.value = false
  }
}
</script>

<template>
  <el-drawer
    v-model="drawerVisible"
    direction="rtl"
    size="640px"
    class="task-drawer"
    :close-on-press-escape="!isEditing"
  >
    <template #header>
      <div class="drawer__header">
        <span class="drawer__heading">Задача</span>
        <div v-if="task" class="drawer__badges">
          <BaseTag :type="statusType" :text="statusTitle" />
          <BaseTag v-if="dueTitle" :type="isOverdue ? 'danger' : 'warning'" :text="dueTitle" />
        </div>
        <el-tooltip v-if="task" content="Удалить задачу" placement="bottom">
          <button class="drawer__tool drawer__tool_danger" type="button" @click="onDelete">
            <el-icon><Delete /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </template>

    <div v-if="task" class="drawer__body">
      <article class="head" :data-status="status">
        <BaseInlineEdit
          :model-value="editing.title"
          label="Название"
          hint="Нажмите, чтобы изменить название"
          :loading="saving.title"
          @update:model-value="onEditToggle('title', $event)"
          @save="saveTitle"
          @cancel="cancelEditing('title')"
        >
          <h2 class="head__title">{{ task.title }}</h2>

          <template #editor>
            <el-input
              v-model="draft.title"
              class="field-control"
              size="large"
              maxlength="255"
              show-word-limit
              placeholder="Название задачи"
            />
          </template>
        </BaseInlineEdit>
      </article>

      <section class="block">
        <BaseInlineEdit
          :model-value="editing.description"
          label="Описание"
          hint="Нажмите, чтобы изменить описание"
          multiline
          :loading="saving.description"
          @update:model-value="onEditToggle('description', $event)"
          @save="saveDescription"
          @cancel="cancelEditing('description')"
        >
          <p class="block__text" :class="{ block__text_empty: !task.description }">
            {{ description }}
          </p>

          <template #editor>
            <el-input
              v-model="draft.description"
              class="field-control"
              type="textarea"
              :rows="6"
              maxlength="1000"
              show-word-limit
              placeholder="Что нужно сделать"
            />
          </template>
        </BaseInlineEdit>
      </section>

      <section class="block">
        <h3 class="block__title">Детали</h3>

        <div class="details">
          <BaseInlineEdit
            class="details__item"
            :model-value="editing.status"
            label="Статус"
            hint="Нажмите, чтобы изменить статус"
            :loading="saving.status"
            @update:model-value="onEditToggle('status', $event)"
            @save="saveStatus"
            @cancel="cancelEditing('status')"
          >
            <span class="details__value">{{ statusTitle }}</span>

            <template #editor>
              <el-select
                v-model="draft.status"
                class="field-control"
                size="large"
                @change="saveStatus"
              >
                <el-option
                  v-for="item in TASK_STATUSES"
                  :key="item"
                  :label="TASK_STATUS_TITLES[item]"
                  :value="item"
                />
              </el-select>
            </template>
          </BaseInlineEdit>

          <BaseInlineEdit
            class="details__item"
            :model-value="editing.due"
            label="Срок выполнения"
            hint="Нажмите, чтобы изменить срок"
            :loading="saving.due"
            @update:model-value="onEditToggle('due', $event)"
            @save="saveDue"
            @cancel="cancelEditing('due')"
          >
            <span class="details__value" :class="{ details__value_danger: isOverdue }">
              {{ dueAt || 'Не указан' }}
            </span>

            <template #editor>
              <el-date-picker
                v-model="draft.dueAt"
                class="field-control"
                type="date"
                size="large"
                value-format="YYYY-MM-DD"
                placeholder="Выберите дату"
                @change="saveDue"
              />
            </template>
          </BaseInlineEdit>

          <div class="details__item">
            <span class="details__label">Создана</span>
            <span class="details__value details__value_static">{{ createdAt }}</span>
          </div>

          <div class="details__item">
            <span class="details__label">Обновлена</span>
            <span class="details__value details__value_static">{{ updatedAt }}</span>
          </div>
        </div>
      </section>

      <section class="block">
        <h3 class="block__title">Теги</h3>
        <TagsInput
          :model-value="tags"
          :max-tags="TASK_TAG_MAX_COUNT"
          :max-length="TASK_TAG_MAX_LENGTH"
          :disabled="isTagsSaving"
          @update:model-value="onTagsChange"
        />
      </section>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.drawer {
  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding-right: 32px;
  }

  &__heading {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__tool {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-left: auto;
    padding: 0;
    font-size: 16px;
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

    &_danger:hover,
    &_danger:focus-visible {
      color: var(--el-color-danger);
      background-color: var(--el-color-danger-light-9);
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-bottom: 4px;
  }
}

.head {
  --hero-accent: var(--el-color-info);

  position: relative;
  padding-left: 18px;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 0;
    width: 4px;
    border-radius: var(--app-radius-pill);
    background-color: var(--hero-accent);
  }

  &[data-status='in_progress'] {
    --hero-accent: var(--el-color-primary);
  }

  &[data-status='done'] {
    --hero-accent: var(--el-color-success);
  }

  &[data-status='cancelled'] {
    --hero-accent: var(--el-color-danger);
  }

  &__title {
    font-size: 25px;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--el-text-color-primary);
    word-break: break-word;
    cursor: text;
  }
}

.block {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: var(--el-text-color-primary);

    &::after {
      content: '';
      flex: 1 1 auto;
      height: 1px;
      background-color: var(--app-border);
    }
  }

  &__text {
    font-size: 15px;
    line-height: 1.65;
    color: var(--el-text-color-regular);
    white-space: pre-line;
    word-break: break-word;
    cursor: text;

    &_empty {
      font-style: italic;
      color: var(--el-text-color-secondary);
    }
  }
}

.field-control {
  width: 100%;
}

.details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    background-color: var(--app-surface-muted);
    border: 1px solid var(--app-border);
    border-radius: var(--app-radius-sm);
    transition:
      background-color var(--app-transition-slow),
      border-color var(--app-transition-slow);
  }

  &__label {
    display: flex;
    align-items: center;
    min-height: 26px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--el-text-color-secondary);
  }

  &__value {
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    word-break: break-word;
    cursor: pointer;

    &_danger {
      color: var(--el-color-danger);
    }

    &_static {
      cursor: default;
    }
  }
}

@media (max-width: 560px) {
  .details {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<style lang="scss">
.el-drawer.task-drawer {
  --el-drawer-padding-primary: 24px;

  background-color: var(--app-surface-raised);
  border-left: 1px solid var(--app-border);

  .el-drawer__header {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--app-border);
  }

  .el-drawer__body {
    padding-top: 0;
  }
}

@media (max-width: 768px) {
  /* Ширина задаётся инлайн-стилем через prop size, поэтому переопределяем через !important */
  .el-drawer.task-drawer {
    width: calc(100vw - 32px) !important;
  }
}

@media (max-width: 640px) {
  .el-drawer.task-drawer {
    width: calc(100vw - 16px) !important;
  }
}
</style>
