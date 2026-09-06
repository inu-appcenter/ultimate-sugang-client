import type { ReactNode } from 'react'
import type { ColumnDef } from '@/features/sukang/columns'
import { ActionButton, type ActionKind } from '@/features/sukang/components/ActionButton'
import { CourseTitleCell } from '@/features/sukang/components/CourseTitleCell'
import type { TableStatus } from '@/features/sukang/hooks'
import type { Course } from '@/features/sukang/schemas'
import { ThEn } from '@/shared/components/ThEn'

/** 조회 결과 행 또는 신청내역 행. `courseType` 은 조회 = Course.courseType, 신청내역 = Enrollment.resolvedType(02 §4-2). */
export interface CourseTableRow {
  id: string
  course: Course
  courseType: string
  /** 신청내역 순번(1부터) */
  no?: number
  /** 신청내역 재수강 구분(신규 = 빈 값) */
  reAttendance?: string
  /** 'enroll' 이라도 course.isClosed 면 `마감` 으로 렌더(핸들러 없음) */
  action: ActionKind
}

interface CourseTableProps {
  columns: readonly ColumnDef[]
  rows: readonly CourseTableRow[]
  status: TableStatus
  /** 원 `summary` 대체(03 §5-9) */
  ariaLabel: string
  onAction?: (row: CourseTableRow) => void
}

/** 05 §4-4 행 색: 마감 grey 우선, 야간 brown */
const rowClassName = (course: Course): string | undefined =>
  course.isClosed ? 'grey' : course.isNight ? 'brown' : undefined

const cellClassName = (index: number, col: ColumnDef): string | undefined =>
  index === 0 ? 'first' : col.key === 'action' ? 'last' : undefined

function renderCell(
  col: ColumnDef,
  index: number,
  row: CourseTableRow,
  onAction: CourseTableProps['onAction'],
): ReactNode {
  const cls = cellClassName(index, col)
  const { course } = row
  switch (col.key) {
    case 'title':
      return <CourseTitleCell key={col.key} course={course} />
    case 'schedule':
      return (
        <td key={col.key} className="timeInfo">
          {course.schedule.join(' ')}
        </td>
      )
    case 'action': {
      const kind: ActionKind = row.action === 'enroll' && course.isClosed ? 'closed' : row.action
      return (
        <td key={col.key} className={cls}>
          <ActionButton
            kind={kind}
            onClick={kind === 'closed' ? undefined : () => onAction?.(row)}
          />
        </td>
      )
    }
    case 'no':
      return (
        <td key={col.key} className={cls}>
          {row.no ?? ''}
        </td>
      )
    case 'courseType':
      return (
        <td key={col.key} className={cls}>
          {row.courseType}
        </td>
      )
    case 'reAttendance':
      return (
        <td key={col.key} className={cls}>
          {row.reAttendance ?? ''}
        </td>
      )
    case 'en':
      /* 원어여부 대응 필드 없음(Q-14) → 빈 셀(01 §3-6) */
      return <td key={col.key} className={cls} />
    case 'grade':
      return (
        <td key={col.key} className={cls}>
          {course.grade}
        </td>
      )
    case 'courseArea':
      return (
        <td key={col.key} className={cls}>
          {course.courseArea}
        </td>
      )
    case 'code':
      return (
        <td key={col.key} className={cls}>
          {course.code}
        </td>
      )
    case 'credits':
      return (
        <td key={col.key} className={cls}>
          {course.credits}
        </td>
      )
    case 'department':
      return (
        <td key={col.key} className={cls}>
          {course.department}
        </td>
      )
    case 'professor':
      return (
        <td key={col.key} className={cls}>
          {course.professor}
        </td>
      )
  }
}

/**
 * 05 §4 결과 테이블 공통 `table.dataT` — colgroup(D10) + thead(ko/en) + 4상태(D9: Data 만 행 렌더).
 * 조회 목록(sch_areaT 안)과 신청내역(스크롤 없음) 모두 이 컴포넌트를 쓴다.
 */
export function CourseTable({ columns, rows, status, ariaLabel, onAction }: CourseTableProps) {
  return (
    <table className="dataT" aria-label={ariaLabel}>
      <colgroup>
        {columns.map((col) => (
          <col key={col.key} style={{ width: col.width }} />
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
