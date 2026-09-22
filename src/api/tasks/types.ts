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
}

export type TTaskCreateRequest = {
  title: string
  description?: string | null
  dueAt?: string | null
  projectId?: string | null
}

export type TTaskUpdateRequest = {
  title?: string
  description?: string | null
  dueAt?: string | null
  projectId?: string | null
  status?: ETaskStatus
}
