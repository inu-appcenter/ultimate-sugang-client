import type { ScreenKey } from '@/features/sukang/constants/screens'

export interface NoticeLine {
  text: string
  emphasis?: 'red' | 'blue'
}

// 문구·불릿(▒ U+2592)·띄어쓰기 원문 유지 → .claude/spec/convention/02_ui.md §5
export const SCREEN_NOTICES: Partial<Record<ScreenKey, readonly NoticeLine[]>> = {
  Jungong: [
    { text: '* <수강신청> 개설 강좌 리스트 선택부분입니다.' },
    {
      text: '▒ 학수번호가 달라도 교과목명이 같으면 동일 과목이므로 중복 수강입니다.',
      emphasis: 'red',
    },
    { text: '▒ 학과에 문의하여 지도를 받은 후 수강신청 하시기 바랍니다.' },
  ],
  Gyoyang: [
    { text: '* <수강신청> 교양과목 : 기초교양, 핵심교양, 심화교양, 교직, 군사학, 일반선택 등.' },
    {
      text: '▒ 기초교양, 핵심교양, 심화교양 교과목에 대한 수강문의는 기초교육원으로 하시기 바랍니다.',
      emphasis: 'blue',
    },
    { text: '▒ 학과에 문의하여 지도를 받은 후 수강신청 하시기 바랍니다.', emphasis: 'blue' },
    { text: '▒ 화면에서 원하는 조건을 선택하시고 조회를 누르세요.' },
    { text: '▒ 기초교양, 핵심교양, 심화교양을 선택하면 이수영역별 지정 조회가 가능 합니다.' },
  ],
  Tagwa: [
    { text: '* <수강신청> 타학과 개설강좌리스트 입니다.' },
    { text: '▒ 화면에서 원하는 조건을 선택하시고 조회를 누르세요.' },
  ],
  Yungae: [
    { text: '* <수강신청> 연계전공 개설강좌리스트 입니다.' },
    { text: '▒ 화면에서 원하는 조건을 선택하시고 조회를 누르세요.' },
  ],
  Custom: [
    { text: '* <수강신청> 과목명 개설강좌리스트 입니다.' },
    { text: '▒ 두글자 이상의 과목명 또는 학수번호를 입력하신 후 조회를 누르세요.' },
  ],
}
