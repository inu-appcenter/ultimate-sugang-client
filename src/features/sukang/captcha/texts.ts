export const CAPTCHA_TOTAL = 10

export type CaptchaEm = 'em_blue' | 'em_red'
export interface CaptchaSegment {
  text: string
  em?: CaptchaEm
}

const BODY: readonly (readonly CaptchaSegment[])[] = [
  [
    { text: '1. 이미지에 보이는 숫자 4글자를 입력하고 ' },
    { text: '"확인"', em: 'em_blue' },
    { text: ' 버튼을 클릭하세요.' },
  ],
  [
    {
      text: 'Enter the four-digits number(string) that appears in the image and click the "Confirm" button.',
    },
  ],
  [
    { text: '2. 오류 누적 횟수가 ' },
    { text: '10', em: 'em_red' },
    { text: '회가 되면 자동 로그아웃 됩니다.' },
  ],
  [
    { text: '(문자열 오류 총 ' },
    { text: '10', em: 'em_red' },
    { text: '회 중 ' },
    { text: '{N}', em: 'em_red' },
    { text: '회 남음)' },
  ],
  [
    { text: 'If the string is still incorrect more than ' },
    { text: '10', em: 'em_red' },
    { text: ' times, you will be log out automatically.' },
  ],
  [
    { text: '(Total : ' },
    { text: '10', em: 'em_red' },
    { text: '  Remain : ' },
    { text: '{N}', em: 'em_red' },
    { text: ')' },
  ],
  [{ text: '3. 입력한 문자열이 맞을 경우 이전 요청이 자동 수행됩니다.' }],
]

// 원문 오탈자 '잘 못' 유지 → .claude/spec/convention/03_login_captcha.md §2
export const CAPTCHA_TEXT = {
  title: '수강신청 매크로 방지',
  inputLabel: '※ 문자열 입력 :',
  confirm: '확인(Confirm)',
  close: '닫기',
  error:
    '문자열을 잘 못 입력하였습니다. 다시 입력하세요.\nYou entered the wrong string. Try again...',
} as const

export const captchaBodyLines = (remain: number): (readonly CaptchaSegment[])[] =>
  BODY.map((line) => line.map((seg) => ({ ...seg, text: seg.text.replace('{N}', String(remain)) })))
