export type TTask = {
  id: string
  title: string
  description: string
  completed: boolean
  status: string
  created_at: string
  updated_at: string
  story_points: number
  board_id: string
}

export type TTaskCreateRequest = {
  title: string
  description: string
  story_points: number
  board_id: string
  column: string
}
