import type { ReactNode } from 'react'
import type { ColumnDef, ColumnKey } from '@/features/sukang/columns'
import { ActionButton, type ActionKind } from '@/features/sukang/components/ActionButton'
import { CourseTitleCell } from '@/features/sukang/components/CourseTitleCell'
import type { Course } from '@/features/sukang/schemas'
import type { TableStatus } from '@/features/sukang/tableStatus'
import { ThEn } from '@/shared/components/ThEn'

const EN_MARK = 'EN(원어)'

export interface CourseTableRow {
  id: string
  course: Course
  courseType: string
  no?: number
  reAttendance?: string
  action: ActionKind
}

interface CourseTableProps {
  columns: readonly ColumnDef[]
  rows: readonly CourseTableRow[]
  status: TableStatus
  ariaLabel: string
  onAction?: (row: CourseTableRow) => void
}

type TextColumnKey = Exclude<ColumnKey, 'title' | 'schedule' | 'action'>

const CELL_TEXT: Record<TextColumnKey, (row: CourseTableRow) => string | number> = {
  no: (row) => row.no ?? '',
  courseType: (row) => row.courseType,
  courseArea: (row) => row.course.courseArea,
  code: (row) => row.course.code,
  credits: (row) => row.course.credits,
  en: (row) => (row.course.isEnglish ? EN_MARK : ''),
  grade: (row) => row.course.grade,
  department: (row) => row.course.department,
  reAttendance: (row) => row.reAttendance ?? '',
  professor: (row) => row.course.professor,
}

function rowClassName(course: Course): string | undefined {
  if (course.isClosed) return 'grey'
  if (course.isNight) return 'brown'
  return undefined
}

function cellClassName(index: number, col: ColumnDef): string | undefined {
  if (index === 0) return 'first'
  if (col.key === 'action') return 'last'
  return undefined
}

function renderCell(
  col: ColumnDef,
  index: number,
  row: CourseTableRow,
  onAction: CourseTableProps['onAction'],
): ReactNode {
  if (col.key === 'title') return <CourseTitleCell key={col.key} course={row.course} />
  if (col.key === 'schedule')
    return (
      <td key={col.key} className="timeInfo">
        {row.course.schedule}
      </td>
    )

  const className = cellClassName(index, col)
  if (col.key === 'action') {
    const kind: ActionKind = row.action === 'enroll' && row.course.isClosed ? 'closed' : row.action
    return (
      <td key={col.key} className={className}>
        <ActionButton kind={kind} onClick={kind === 'closed' ? undefined : () => onAction?.(row)} />
      </td>
    )
  }
  return (
    <td key={col.key} className={className}>
      {CELL_TEXT[col.key](row)}
    </td>
  )
}

export function CourseTable({ columns, rows, status, ariaLabel, onAction }: CourseTableProps) {
  return (
    <table className="dataT" aria-label={ariaLabel} aria-busy={status === 'loading'}>
      <colgroup>
        {/* width="" = 잔여폭 흡수 → .claude/spec/convention/02_ui.md §6 */}
        {columns.map((col) => (
          <col key={col.key} width={col.width === null ? '' : `${col.width}px`} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={col.key} scope="col" className={cellClassName(i, col)}>
              {col.ko}
              {col.en !== undefined && (
                <>
                  <br />
                  <ThEn>{col.en}</ThEn>
                </>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {status === 'data' &&
          rows.map((row) => (
            <tr key={row.id} className={rowClassName(row.course)}>
              {columns.map((col, i) => renderCell(col, i, row, onAction))}
            </tr>
          ))}
      </tbody>
    </table>
  )
}
