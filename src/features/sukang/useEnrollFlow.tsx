import type { ReactNode } from 'react'
import { useCaptchaGate } from '@/features/sukang/captcha/useCaptchaGate'
import { MESSAGES } from '@/features/sukang/constants/messages'
import { reportSukangError } from '@/features/sukang/errors'
import { useEnroll } from '@/features/sukang/hooks'
import type { Course } from '@/features/sukang/schemas'
import { dialog } from '@/shared/lib/dialog'

export function useEnrollFlow(): { requestEnroll: (course: Course) => void; modal: ReactNode } {
  const enroll = useEnroll()
  const gate = useCaptchaGate()

  const requestEnroll = (course: Course) => {
    if (enroll.isPending) return
    gate.guard(() =>
      enroll.mutate(course.id, {
        onSuccess: (result) => dialog.alert(MESSAGES.ENROLL_OK(result.course.name)),
        onError: (err) => reportSukangError(err),
      }),
    )
  }

  return { requestEnroll, modal: gate.modal }
}
