/**
 * 02 §5 enum·코드 체계 — 값 추가/변경 금지 (rules/api-contract.md).
 * TAGWA_LIST(76)·YUNGAE_LIST(32) 는 .claude/spec/02_api_spec.md §5-2/§5-3 원문에서 스크립트로 그대로 추출했다.
 * select 코드값 미제공(Q-14) → mock 은 이름 문자열을 값으로 쓴다(D1).
 */

/** 02 §5-5 교과목명 태그 */
export const COURSE_TAGS = ['[75분수업]', '[온라인혼합형강좌]', '[e-Learning]'] as const
export type CourseTag = (typeof COURSE_TAGS)[number]

/** 02 §5-4 select placeholder 원문 — '=' 개수 select 마다 다름, 그대로 사용 */
export const PLACEHOLDERS = {
  cmbCptnGbn: '===== 이수구분 =====',
  cmbFldGnb: '===== 이수영역 =====',
  cmbTagwaCd: '========== 학과(부) ==========',
  cmbYungaeCd: '========== 연계전공 ==========',
} as const

export interface CodeOption {
  code: string
  name: string
}

/** 02 §5-1 교양 2단 트리 — 1단 이수구분(cmbCptnGbn). 3단계 없음. */
export const CPTN_GBN_CODES = ['11', '21', '23', '50', '70', '80'] as const
export type CptnGbnCode = (typeof CPTN_GBN_CODES)[number]
/** 하위 이수영역 select 가 있는 1단 코드(11/21/23) — 코드값이 곧 하위 select id 접미사 */
export const FLD_GNB_PARENT_CODES = ['11', '21', '23'] as const
export type FldGnbParentCode = (typeof FLD_GNB_PARENT_CODES)[number]

export interface CptnGbnOption extends CodeOption {
  code: CptnGbnCode
  /** 하위 select id (`cmbFldGnb` + 코드) 또는 null(50/70/80) */
  childId: `cmbFldGnb${FldGnbParentCode}` | null
}
export const CPTN_GBN: readonly CptnGbnOption[] = [
  { code: '11', name: '기초교양', childId: 'cmbFldGnb11' },
  { code: '21', name: '핵심교양', childId: 'cmbFldGnb21' },
  { code: '23', name: '심화교양', childId: 'cmbFldGnb23' },
  { code: '50', name: '교직', childId: null },
  { code: '70', name: '군사학', childId: null },
  { code: '80', name: '일반선택', childId: null },
]

/** 02 §5-1 하위 이수영역(cmbFldGnb11/21/23). `ㆍ` = U+318D (일반 · U+00B7 아님). */
export const FLD_GNB: Record<FldGnbParentCode, readonly CodeOption[]> = {
  '11': [
    { code: '161', name: '학문의기초' },
    { code: '162', name: '기초과학\u318D공학' },
  ],
  '21': [
    { code: '171', name: '(핵심)INU세미나' },
    { code: '172', name: '(핵심)인문' },
    { code: '173', name: '(핵심)사회' },
    { code: '174', name: '(핵심)과학기술' },
    { code: '175', name: '(핵심)예술체육' },
    { code: '176', name: '(핵심)외국어' },
  ],
  '23': [
    { code: '182', name: '인문' },
    { code: '183', name: '사회' },
    { code: '184', name: '과학기술' },
    { code: '185', name: '예술체육' },
    { code: '186', name: '외국어' },
  ],
}

export const isCptnGbnCode = (v: string): v is CptnGbnCode =>
  (CPTN_GBN_CODES as readonly string[]).includes(v)
export const isFldGnbParentCode = (v: string): v is FldGnbParentCode =>
  (FLD_GNB_PARENT_CODES as readonly string[]).includes(v)
export const cptnGbnName = (code: string): string | undefined =>
  CPTN_GBN.find((o) => o.code === code)?.name
export const fldGnbName = (parent: string, code: string): string | undefined =>
  isFldGnbParentCode(parent) ? FLD_GNB[parent].find((o) => o.code === code)?.name : undefined

/** 02 §5-2 타학과 학과(부) 76개 — 원문 순서(영문 → 가나다), 야간 `(야)` 접미 */
export const TAGWA_LIST: readonly string[] = [
  'Global Trade & Service학부',
  'HUSS(교류대학)',
  'HUSS(타대학)',
  'HUSS포용사회이니셔티브학부',
  'IBE전공',
  '건설환경공학전공',
  '건축공학전공',
  '경영학부',
  '경제학과',
  '경제학과(야)',
  '공연예술학과',
  '국어교육과',
  '국어국문학과',
  '기계공학과',
  '나노바이오공학전공',
  '데이터과학과',
  '도시건축학부',
  '도시건축학전공',
  '도시공학과',
  '도시행정학과',
  '도시환경공학부',
  '독어독문학과',
  '동북아국제통상전공',
  '디자인학부',
  '무역학부(야)',
  '문헌정보학과',
  '물리학과',
  '미디어커뮤니케이션학과',
  '바이오-로봇시스템공학과',
  '반도체융합전공',
  '법학부',
  '분자의생명전공',
  '불어불문학과',
  '사회복지학과',
  '산업경영공학과',
  '생명공학부',
  '생명공학전공',
  '생명과학부',
  '생명과학전공',
  '서양화전공',
  '세무회계학과',
  '소비자학과',
  '수학과',
  '수학교육과',
  '스마트물류공학전공',
  '스포츠과학부',
  '신소재공학과',
  '안전공학과',
  '에너지화학공학과',
  '역사교육과',
  '영어교육과',
  '영어영문학과',
  '운동건강학부',
  '유아교육과',
  '윤리교육과',
  '일본지역문화학과',
  '일어교육과',
  '임베디드시스템공학과',
  '자유전공학부',
  '전기공학과',
  '전자공학과',
  '전자공학부',
  '전자공학전공',
  '정보통신공학과',
  '정치외교학과',
  '조형예술학부',
  '중어중국학과',
  '창의인재개발학과',
  '체육교육과',
  '컴퓨터공학부',
  '패션산업학과',
  '한국화전공',
  '해양학과',
  '행정학과',
  '화학과',
  '환경공학전공',
]

/** 02 §5-3 연계전공 32개 — 이름에 쉼표 포함 2건(쉼표 분리 금지) */
export const YUNGAE_LIST: readonly string[] = [
  'INU리버럴아츠연계전공',
  'MICE,스포츠및관광연계전공',
  '공연예술과시각예술연계전공',
  '공중보건연계전공',
  '광전자공학전공(연계)',
  '국제개발협력연계전공',
  '국제비즈니스및세무연계전공',
  '글로벌기업가정신연계전공',
  '기후,에너지및환경연계전공',
  '녹색기후연계전공',
  '녹색도시연계전공',
  '동북아지역학전공(연계)',
  '물류학전공(연계)',
  '미래교육디자인연계전공',
  '미래도시연계전공',
  '미래자동차연계전공',
  '바이오융합·창업연계전공',
  '뷰티산업연계전공',
  '소셜데이터사이언스연계전공',
  '신재생에너지연계전공',
  '유럽통상학전공(연계)',
  '유전체학연계전공',
  '인공지능·창업연계전공',
  '인공지능소프트웨어연계전공',
  '인문문화예술기획연계전공',
  '줄기세포및조직공학연계전공',
  '중국연구연계전공',
  '중국지역학전공(연계)',
  '지능로봇연계전공',
  '지능형로봇시스템연계전공',
  '창의적디자인연계전공',
  '항체공학연계전공',
]

/** 02 §5-7 출력 타입 (동작은 Q-5 전 없음) */
export const PRINT_TYPES = ['check', 'apply'] as const
export type PrintType = (typeof PRINT_TYPES)[number]
