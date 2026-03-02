export type TBoard = {
  id: string
  title: string
  description: string
  status: EBoardStatus
}

export type TBoardCreateRequest = {
  title: string
  description: string
}

export enum EBoardStatus {
  active = 'active',
  paused = 'paused',
}
