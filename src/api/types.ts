export type TResponse<T> = {
  data: T
  meta: {
    total?: number
    limit?: number
    offset?: number
    count?: number
  }
}
