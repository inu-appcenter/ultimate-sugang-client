import { formatTag } from '@/features/sukang/constants/codes'
import type { Course } from '@/features/sukang/schemas'

export function CourseTitleCell({ course }: { course: Course }) {
  return (
    <td className="ltf">
      <b>
        {course.name}
        {course.tags.map((tag) => (
          <span key={tag} className="tag">
            {' '}
            {formatTag(tag)}
          </span>
        ))}
      </b>{' '}
      <br />({course.nameEn})
    </td>
  )
}
