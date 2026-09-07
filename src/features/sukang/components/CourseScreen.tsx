import type { ReactNode } from 'react'
import { SCREEN_COLUMNS } from '@/features/sukang/columns'
import { CourseTable, type CourseTableRow } from '@/features/sukang/components/CourseTable'
import { GuideBox } from '@/features/sukang/components/GuideBox'
import { ResultArea } from '@/features/sukang/components/ResultArea'
import { ScreenTitle } from '@/features/sukang/components/ScreenTitle'
import { SCREEN_NOTICES } from '@/features/sukang/constants/notices'
import { SCREENS, screenLabelOf, type ScreenKey } from '@/features/sukang/constants/screens'
import { useCourseList, type CourseParams } from '@/features/sukang/hooks'
import { tableStatusOf } from '@/features/sukang/tableStatus'
import { useEnrollFlow } from '@/features/sukang/useEnrollFlow'
import { useErrorAlert } from '@/features/sukang/useErrorAlert'

interface CourseScreenProps<K extends ScreenKey> {
  screen: K
  params: CourseParams<K> | null
  search?: ReactNode
  onSearch?: () => void
}

export function CourseScreen<K extends ScreenKey>({
  screen,
  params,
  search,
  onSearch,
}: CourseScreenProps<K>) {
  const meta = SCREENS[screen]
  const courses = useCourseList(screen, params)
  const { requestEnroll, modal } = useEnrollFlow()
  useErrorAlert(courses.error)

  const rows: CourseTableRow[] = (courses.data ?? []).map((course) => ({
    id: course.id,
    course,
    courseType: course.courseType,
    action: 'enroll',
  }))
  const isBeforeSearch = params === null
  const notice = meta.hasNotice ? SCREEN_NOTICES[screen] : undefined

  return (
    <>
      <ScreenTitle
        title={meta.title}
        search={search}
        onSearch={onSearch}
        searching={courses.isFetching}
      />
      {isBeforeSearch ? (
        <GuideBox lines={notice ?? []} />
      ) : (
        <ResultArea busy={courses.isFetching}>
          <CourseTable
            columns={SCREEN_COLUMNS[screen]}
            rows={rows}
            status={tableStatusOf(courses)}
            ariaLabel={screenLabelOf(meta)}
            onAction={(row) => requestEnroll(row.course)}
          />
        </ResultArea>
      )}
      {modal}
    </>
  )
}
