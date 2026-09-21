export type TTask = {
  id: string
  title: string
  description?: string | null
  dueAt?: string | null
  createdAt: string
  updatedAt: string
  userId?: string | null
  projectId?: string | null
}

export type TTaskCreateRequest = {
  title: string
  description?: string | null
  dueAt?: string | null
  projectId?: string | null
}
