import { isSukangError, type CatalogErrorCode } from '@/features/sukang/api/types'

/**
 * 02 §4-3 · 01 §6-5 메시지 카탈로그 — 원문 그대로. 포맷 `한글` + `\n` + 공백 1칸 + `영문`(03 §5-3).
 * 오탈자·띄어쓰기 원문 유지(D5: `신청 하였습니다`). TIMEOUT·UNKNOWN 은 하네스 작성(D6).
 * 채널은 전부 네이티브 alert/confirm(D2).
 */
export const MESSAGES = {
  /** 신청 성공 alert — `{교과목명}` = Course.name(태그 제외) */
  ENROLL_OK: (courseName: string) =>
    `${courseName} 교과목 신청이 완료되었습니다.\n Application completed.`,
  /** 취소 확인 confirm */
  CANCEL_CONFIRM: '신청하신 과목을 취소하시겠습니까?',
  /** 취소 완료 alert */
  CANCEL_OK: '수강취소가 완료되었습니다.\n Application canceled.',
} as const

/** 에러 종별 → alert 문구(02 §4-3). */
export const ERROR_MESSAGES: Record<CatalogErrorCode, string> = {
  DUP_TIME: '신청된 교과목과 시간이 중복되어 신청할 수 없습니다.\n Duplicated time table.',
  DUP_SUBJECT: '동일한 과목명을 이미 신청 하였습니다.\n Duplicated Subject.',
  CREDIT_EXCEEDED: '신청 가능 학점을 초과하여 신청할 수 없습니다.\n Credit limit exceeded.',
  CLASS_FULL: '해당 강좌는 마감되었습니다.\n Class is full.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인하세요.\n Session expired.',
  NOT_IN_PERIOD: '수강신청 기간이 아닙니다.\n Not in registration period.',
  TIMEOUT: '요청 시간이 초과되었습니다. 다시 시도하세요.\n Request timed out.',
}

/** 03 §5-2 ③ 알 수 없는 오류(D6 하네스 작성) */
export const UNKNOWN_ERROR_MESSAGE = '요청 처리 중 오류가 발생했습니다.\n Request failed.'

const isCatalogCode = (code: string): code is CatalogErrorCode => code in ERROR_MESSAGES

/** 03 §5-2 우선순위: ① 카탈로그 문구 → ② TIMEOUT(카탈로그에 포함) → ③ 그 외 UNKNOWN */
export function messageForError(err: unknown): string {
  if (isSukangError(err) && isCatalogCode(err.code)) return ERROR_MESSAGES[err.code]
  return UNKNOWN_ERROR_MESSAGE
}
