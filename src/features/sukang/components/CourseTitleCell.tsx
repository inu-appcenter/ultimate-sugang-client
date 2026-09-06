import type { Course } from '@/features/sukang/schemas'

/**
 * 05 §4-6 교과목명 셀(원§5.5): `<b>한글명[<span class="tag"> 태그</span>]</b> <br>영문명`.
 * 태그는 굵은 한글명 내부, 앞 공백 1칸. 마감 행은 `.dataT .grey .tag { color: inherit }` 로 부모색 상속.
 */
export function CourseTitleCell({ course }: { course: Course }) {
  return (
    <td className="ltf">
      <b>
        {course.name}
        {course.tags.map((tag) => (
          <span key={tag} className="tag">
            {' '}
            {tag}
          </span>
        ))}
      </b>{' '}
      <br />
      {course.nameEn}
    </td>
  )
}
