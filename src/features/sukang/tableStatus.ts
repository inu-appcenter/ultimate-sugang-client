// 4상태 렌더 정책(원본 시각 유지) → .claude/spec/convention/02_ui.md §9
export type TableStatus = 'loading' | 'error' | 'empty' | 'data'

interface TableQuery {
  isPending: boolean
  isFetching: boolean
  isError: boolean
  data: readonly unknown[] | undefined
}

export function tableStatusOf(query: TableQuery): TableStatus {
  if (query.isError) return 'error'
  if (query.data === undefined) return query.isPending && query.isFetching ? 'loading' : 'empty'
  return query.data.length === 0 ? 'empty' : 'data'
}
