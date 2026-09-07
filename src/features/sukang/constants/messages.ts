import { isSukangError, type CatalogErrorCode } from '@/features/sukang/api/types'

// 문구·오탈자·포맷(한글\n 영문) 원문 유지 → .claude/spec/convention/01_data.md §4
export const MESSAGES = {
  ENROLL_OK: (courseName: string) =>
    `${courseName} 교과목 신청이 완료되었습니다.\n Application completed.`,
  CANCEL_CONFIRM: '신청하신 과목을 취소하시겠습니까?',
  CANCEL_OK: '수강취소가 완료되었습니다.\n Application canceled.',
  PRINT_UNSUPPORTED: '연습 사이트에서는 지원하지 않습니다.',
} as const

export const ERROR_MESSAGES: Record<CatalogErrorCode, string> = {
  DUP_TIME: '신청된 교과목과 시간이 중복되어 신청할 수 없습니다.\n Duplicated time table.',
  DUP_SUBJECT: '동일한 과목명을 이미 신청 하였습니다.\n Duplicated Subject.',
  CREDIT_EXCEEDED: '신청 가능 학점을 초과하여 신청할 수 없습니다.\n Credit limit exceeded.',
  CLASS_FULL: '해당 강좌는 마감되었습니다.\n Class is full.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인하세요.\n Session expired.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도하세요.\n Request timed out.',
  COURSE_TYPE_LIMIT: '해당 유형의 과목은 더 이상 신청할 수 없습니다.\n Course type limit exceeded.',
  NOT_REGISTERED: '신청 내역에 없는 과목입니다.\n Course is not registered.',
  CANCEL_FAILED:
    '수강취소를 처리하지 못했습니다. 다시 시도하세요.\n Failed to cancel. Please try again.',
}

export const UNKNOWN_ERROR_MESSAGE = '요청 처리 중 오류가 발생했습니다.\n Request failed.'

const isCatalogCode = (code: string): code is CatalogErrorCode => code in ERROR_MESSAGES

export function messageForError(err: unknown): string {
  if (isSukangError(err) && isCatalogCode(err.code)) return ERROR_MESSAGES[err.code]
  return UNKNOWN_ERROR_MESSAGE
}
