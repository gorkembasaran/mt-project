export interface ApiEnvelope<T> {
  Success: boolean
  Message: string
  Data: T
}

export interface BackendPagedResult<T> {
  Items: T[]
  TotalCount: number
  Page: number
  PageSize: number
  TotalPages: number
}

export interface PagedResult<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export class ApiError extends Error {
  status?: number

  constructor(
    message: string,
    status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
