export type TProject = {
  id: string
  title: string
  description: string
  status: EProjectStatus
}

export type TProjectCreateRequest = {
  title: string
  description: string
}

export enum EProjectStatus {
  active = 'active',
  paused = 'paused',
}
