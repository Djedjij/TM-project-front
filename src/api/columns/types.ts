export type TColumn = {
  id: string
  title: string
  project_id: string
  status: string
}

export type TColumnCreateRequest = {
  title: string
  project_id: string
  status: string
}
