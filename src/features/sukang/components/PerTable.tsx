import { PER_TABLE_COL_WIDTHS } from '@/features/sukang/columns'
import { PER_TABLE_LABELS, SEMESTER_TITLE } from '@/features/sukang/constants/screens'
import { useStudent } from '@/features/sukang/hooks'
import { useErrorAlert } from '@/features/sukang/useErrorAlert'
import { ThEn } from '@/shared/components/ThEn'

// <colgroup> 7개가 없으면 fixed 레이아웃이 7등분한다 → .claude/spec/convention/02_ui.md §2
export function PerTable() {
  const studentQuery = useStudent()
  useErrorAlert(studentQuery.error)

  const student = studentQuery.data
  const department = student ? student.department : ''
  const idName = student ? `${student.id} / ${student.name}` : ''
  const gradeStatus = student ? `${String(student.grade)} / ${student.status}` : ''

  return (
    <table className="perT">
      <colgroup>
        {PER_TABLE_COL_WIDTHS.map((width, i) => (
          <col key={`perT-col-${String(i)}`} style={{ width }} />
        ))}
      </colgroup>
      <tbody>
        <tr>
          <th scope="col" className="titY">
            {SEMESTER_TITLE.ko}
            <br />
            {SEMESTER_TITLE.en}
          </th>
          <th scope="row">
            {PER_TABLE_LABELS.department.ko}
            <br />
            <ThEn>{PER_TABLE_LABELS.department.en}</ThEn>
          </th>
          <td>{department}</td>
          <th scope="row">
            {PER_TABLE_LABELS.idName.ko}
            <br />
            <ThEn>{PER_TABLE_LABELS.idName.en}</ThEn>
          </th>
          <td>{idName}</td>
          <th scope="row">
            {PER_TABLE_LABELS.gradeStatus.ko}
            <br />
            <ThEn>{PER_TABLE_LABELS.gradeStatus.en}</ThEn>
          </th>
          <td>{gradeStatus}</td>
        </tr>
      </tbody>
    </table>
  )
}
