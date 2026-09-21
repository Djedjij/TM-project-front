export type TProjectOwner = {
  id: string
  email: string
}

export type TProjectMember = {
  id: string
  userId: string
  role: string
  createdAt: string
  user: TProjectOwner
}

export type TProject = {
  id: string
  title: string
  description?: string | null
  status?: EProjectStatus
  ownerId?: string
  createdAt?: string
  updatedAt?: string
  owner?: TProjectOwner
  members?: TProjectMember[]
}

export type TProjectCreateRequest = {
  title: string
  description: string
}

export enum EProjectStatus {
  active = 'active',
  paused = 'paused',
}
