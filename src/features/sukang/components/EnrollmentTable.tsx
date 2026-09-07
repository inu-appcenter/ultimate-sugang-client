import { ENROLLMENT_COLUMNS } from '@/features/sukang/columns'
import { CourseTable, type CourseTableRow } from '@/features/sukang/components/CourseTable'
import type { EnrollmentRow } from '@/features/sukang/schemas'
import type { TableStatus } from '@/features/sukang/tableStatus'

interface EnrollmentTableProps {
  rows: readonly EnrollmentRow[]
  status: TableStatus
  onCancel: (courseId: string) => void
}

export function EnrollmentTable({ rows, status, onCancel }: EnrollmentTableProps) {
  const tableRows: CourseTableRow[] = [...rows]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((row, index) => ({
      id: row.courseId,
      course: row.course,
      courseType: row.resolvedType,
      no: index + 1,
      reAttendance: row.reAttendance,
      action: 'cancel',
    }))

  return (
    <CourseTable
      columns={ENROLLMENT_COLUMNS}
      rows={tableRows}
      status={status}
      ariaLabel="수강신청내역"
      onAction={(row) => onCancel(row.id)}
    />
  )
}
