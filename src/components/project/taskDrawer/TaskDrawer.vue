<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseTag from '@/components/base/tag/BaseTag.vue'
import TagsInput from '@/components/base/tagsInput/TagsInput.vue'
import toast from '@/components/base/toast/toast'
import { ETaskStatus, TASK_TAG_MAX_COUNT, TASK_TAG_MAX_LENGTH, TTask } from '@/api/tasks/types'
import { TASK_STATUS_TITLES, TASK_STATUS_TYPES } from '@/components/project/taskStatus'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps<{
  modelValue: boolean
  task: TTask | null
}>()

const emit = defineEmits(['update:modelValue', 'deleted'])

const drawerVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { updateTaskData, updateTaskTags, deleteTaskById } = useTasksStore()

type TTaskForm = {
  title: string
  description: string
  dueAt: string | null
}

const isEditing = ref(false)
const isSaving = ref(false)
const isTagsSaving = ref(false)

const form = reactive<TTaskForm>({
  title: '',
  description: '',
  dueAt: null,
})

const formatDate = (value?: string | null) => (value ? dayjs(value).format('DD.MM.YYYY') : '')

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

const resetForm = () => {
  form.title = props.task?.title ?? ''
  form.description = props.task?.description ?? ''
  form.dueAt = props.task?.dueAt ? dayjs(props.task.dueAt).format('YYYY-MM-DD') : null
}

// При открытии панели (или смене задачи) выходим из режима редактирования
watch(
  () => [props.modelValue, props.task?.id] as const,
  ([isOpen]) => {
    if (!isOpen) return

    isEditing.value = false
    resetForm()
  },
  { immediate: true },
)

const startEditing = () => {
  resetForm()
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const onSave = async () => {
  const task = props.task
  if (!task) return

  if (!form.title.trim()) {
    toast.error('Укажите название задачи')
    return
  }

  isSaving.value = true
  const updatedTask = await updateTaskData(task.id, {
    title: form.title.trim(),
    description: form.description.trim() || null,
    dueAt: form.dueAt || null,
  })
  isSaving.value = false

  if (updatedTask) {
    isEditing.value = false
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

  try {
    await ElMessageBox.confirm(
      'Задача будет удалена без возможности восстановления',
      'Удалить задачу?',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      },
    )
  } catch {
    // Пользователь отказался от удаления
    return
  }

  const isDeleted = await deleteTaskById(task.id)

  if (isDeleted) {
    emit('deleted', task.id)
    drawerVisible.value = false
  }
}
</script>

<template>
  <el-drawer v-model="drawerVisible" direction="rtl" size="480px" class="task-drawer">
    <template #header>
      <div class="drawer__header">
        <span class="drawer__heading">Задача</span>
        <div v-if="task" class="drawer__badges">
          <BaseTag :type="statusType" :text="statusTitle" />
          <BaseTag v-if="dueTitle" :type="isOverdue ? 'danger' : 'warning'" :text="dueTitle" />
        </div>
      </div>
    </template>

    <div v-if="task" class="drawer__body">
      <el-form v-if="isEditing" :model="form" label-width="auto" class="form">
        <el-form-item label="Название задачи">
          <el-input v-model="form.title" maxlength="255" placeholder="Название задачи" />
        </el-form-item>
        <el-form-item label="Описание">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            maxlength="1000"
            placeholder="Что нужно сделать"
          />
        </el-form-item>
        <el-form-item label="Срок выполнения">
          <el-date-picker
            v-model="form.dueAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="Выберите дату"
          />
        </el-form-item>
      </el-form>

      <template v-else>
        <h2 class="drawer__title">{{ task.title }}</h2>

        <p class="drawer__description" :class="{ drawer__description_empty: !task.description }">
          {{ description }}
        </p>

        <dl class="meta">
          <div class="meta__row">
            <dt class="meta__label">Создана</dt>
            <dd class="meta__value">{{ createdAt }}</dd>
          </div>
          <div class="meta__row">
            <dt class="meta__label">Обновлена</dt>
            <dd class="meta__value">{{ updatedAt }}</dd>
          </div>
          <div class="meta__row">
            <dt class="meta__label">Срок</dt>
            <dd class="meta__value">{{ dueAt || 'Не указан' }}</dd>
          </div>
        </dl>
      </template>

      <section class="tags">
        <h3 class="tags__title">Теги</h3>
        <TagsInput
          :model-value="tags"
          :max-tags="TASK_TAG_MAX_COUNT"
          :max-length="TASK_TAG_MAX_LENGTH"
          :disabled="isTagsSaving"
          @update:model-value="onTagsChange"
        />
      </section>
    </div>

    <template #footer>
      <div v-if="task" class="drawer__footer">
        <BaseButton type="danger" text="Удалить" @click="onDelete" />

        <div class="drawer__actions">
          <template v-if="isEditing">
            <BaseButton type="default" text="Отмена" @click="cancelEditing" />
            <BaseButton type="primary" text="Сохранить" :loading="isSaving" @click="onSave" />
          </template>
          <BaseButton v-else type="primary" text="Редактировать" @click="startEditing" />
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.drawer {
  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding-right: 16px;
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

  &__body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__title {
    font-size: 22px;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--el-text-color-primary);
    word-break: break-word;
  }

  &__description {
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
    white-space: pre-line;
    word-break: break-word;

    &_empty {
      color: var(--el-text-color-secondary);
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  background-color: var(--app-surface-muted);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);

  &__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
  }

  &__label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__value {
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.tags {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    font-size: 15px;
    color: var(--el-text-color-primary);
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>

<style lang="scss">
.el-drawer.task-drawer {
  --el-drawer-padding-primary: 20px;

  background-color: var(--app-surface-raised);
  border-left: 1px solid var(--app-border);

  .el-drawer__header {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--app-border);
  }

  .el-drawer__body {
    padding-top: 0;
  }

  .el-drawer__footer {
    padding-top: 16px;
    border-top: 1px solid var(--app-border);
  }
}

@media (max-width: 640px) {
  /* Ширина задаётся инлайн-стилем через prop size, поэтому переопределяем через !important */
  .el-drawer.task-drawer {
    width: calc(100vw - 24px) !important;
  }
}
</style>
