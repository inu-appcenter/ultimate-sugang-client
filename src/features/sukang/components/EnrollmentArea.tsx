import { EnrollmentTable } from '@/features/sukang/components/EnrollmentTable'
import { PrintButtons } from '@/features/sukang/components/PrintButtons'
import { MESSAGES } from '@/features/sukang/constants/messages'
import { ENROLLMENT_TITLE } from '@/features/sukang/constants/screens'
import { reportSukangError } from '@/features/sukang/errors'
import { useCancel, useEnrollments } from '@/features/sukang/hooks'
import { tableStatusOf } from '@/features/sukang/tableStatus'
import { useErrorAlert } from '@/features/sukang/useErrorAlert'
import { dialog } from '@/shared/lib/dialog'

// 출력 버튼은 .tit_sub 안 float — .tit_sub 에 clearfix 금지 → .claude/spec/convention/02_ui.md §8
export function EnrollmentArea() {
  const enrollments = useEnrollments()
  const cancel = useCancel()
  useErrorAlert(enrollments.error)

  const handleCancel = (courseId: string) => {
    const isCancelingSameRow = cancel.isPending && cancel.variables === courseId
    if (isCancelingSameRow) return
    if (!dialog.confirm(MESSAGES.CANCEL_CONFIRM)) return
    cancel.mutate(courseId, {
      onSuccess: () => dialog.alert(MESSAGES.CANCEL_OK),
      onError: (error) => reportSukangError(error),
    })
  }

  return (
    <div className="regi_area">
      <div className="tit_sub">
        <b>
          {ENROLLMENT_TITLE.ko} <span className="tit-en">{ENROLLMENT_TITLE.en}</span>
        </b>{' '}
        {ENROLLMENT_TITLE.hint}
        <PrintButtons />
      </div>
      <div className="leftT">
        <EnrollmentTable
          rows={enrollments.data ?? []}
          status={tableStatusOf(enrollments)}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
