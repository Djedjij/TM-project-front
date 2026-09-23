export enum ETaskStatus {
  created = 'created',
  in_progress = 'in_progress',
  done = 'done',
  cancelled = 'cancelled',
}

export type TTask = {
  id: string
  title: string
  description?: string | null
  dueAt?: string | null
  createdAt: string
  updatedAt: string
  userId?: string | null
  projectId?: string | null
  status?: ETaskStatus
  tag?: string[] | null
}

/** Ограничения поля tag на сервере (schemas/taskSchema.ts) */
export const TASK_TAG_MAX_COUNT = 20
export const TASK_TAG_MAX_LENGTH = 30

export type TTaskCreateRequest = {
  title: string
  description?: string | null
  dueAt?: string | null
  projectId?: string | null
  status?: ETaskStatus
  tag?: string[] | null
}

export type TTaskUpdateRequest = {
  title?: string
  description?: string | null
  dueAt?: string | null
  projectId?: string | null
  status?: ETaskStatus
  tag?: string[] | null
}
