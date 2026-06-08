import { PaginatedResponse } from '@hesperedia/shared-types'

export interface PaginationParams {
  page: number
  pageSize: number
}

export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize ?? '20'), 10) || 20))
  return { page, pageSize }
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  { page, pageSize }: PaginationParams,
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}
