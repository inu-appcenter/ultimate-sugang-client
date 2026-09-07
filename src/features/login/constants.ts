export interface LoginShortcut {
  className: string
  lines: readonly string[]
}

export interface LoginNotice {
  em: 'em_blue' | 'em_red'
  link: boolean
  text: string
}

// 원본 문구 그대로 복원(D54 D5-01) → .claude/spec/convention/03_login_captcha.md §1.1
export const LOGIN_TEXT = {
  logoKo: '인천대학교',
  logoSub: '대학 수강신청',
  logoEn: 'Undergraduate Course Registration',
  heading: 'LOGIN',
  idLabel: '학번 (ID)',
  pwLabel: '비밀번호 (PW)',
  hint: '* 학번(ID) / 비밀번호(PW)는 포털시스템과 동일합니다.',
  findLinks: ['학번(ID)', '비밀번호(PW) 찾기'],
  button: { line1: '로그인', line2: '(Login)' },
  failed: '학번 또는 비밀번호가 올바르지 않습니다.\n Invalid ID or password.',
  shortcuts: [
    { className: 'btn_etc', lines: ['수강신청안내'] },
    { className: 'btn_etc', lines: ['환경설정 및 유의사항'] },
  ],
  shortcutsLast: [
    { className: 'btn_etc', lines: ['대학원 수강신청'] },
    { className: 'btn_etc2', lines: ['교수-자녀간 수강신청', '[사전신고 안내]'] },
  ],
  notices: [
    { em: 'em_blue', link: true, text: '※ 수강신청 URL https://sugang.inu.ac.kr' },
    {
      em: 'em_red',
      link: false,
      text: "※ 호환성 문제에 따라 반드시 'Chrome' 또는 'Edge' 브라우저를 사용하여 수강신청하시기 바랍니다.(Safari 등 사용 불가)",
    },
  ] as const satisfies readonly LoginNotice[],
} as const
