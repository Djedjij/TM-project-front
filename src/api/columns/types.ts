export type TColumn = {
  id: string
  title: string
  board_id: string
  status: string
}

export type TColumnCreateRequest = {
  title: string
  board_id: string
  status: string
}
