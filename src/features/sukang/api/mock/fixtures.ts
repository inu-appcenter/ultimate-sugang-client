import type { Course, Student } from '@/features/sukang/schemas'

/**
 * D22 시드(mock 전용, 실 데이터는 Q-2): 명세 예시 행(원§5.4·§5.5·§10.1·§10.2) + 화면당 소량 픽스처.
 * 명세에 없는 값(교강사·학수번호·강의실 등)은 mock 을 위해 채운 것 — 강의실은 가상 건물 `ZZ`(01 §3-4).
 * 이수구분은 관측값(전공심화·일반선택)과 02 §5-1 교양 6종만 사용(Q-14 enum 미확보).
 */

/** 학생 = 명세 예시(01 §3-6). 학번은 로그인 입력값. creditLimit 실제 값 미확보(Q-14) → mock 기본값 */
export const STUDENT_FIXTURE: Omit<Student, 'id'> = {
  name: '홍○○',
  department: '컴퓨터공학부',
  grade: '4',
  status: '유예',
  creditLimit: 18,
}

type CourseSeed = Partial<Course> & Pick<Course, 'code' | 'name' | 'nameEn' | 'department'>

const course = (seed: CourseSeed): Course => ({
  id: `crs-${seed.code}`,
  professor: '',
  credits: 3,
  capacity: 0,
  enrolled: 0,
  courseType: '전공심화',
  courseArea: '',
  grade: '전학년',
  schedule: [],
  tags: [],
  isNight: false,
  isClosed: false,
  ...seed,
})

/* ---------- 컴퓨터공학부(전공) ---------- */
/** 원§5.4 예시 행: 12학점, 월~금 1~9교시 ZZ-102 */
export const INTERNSHIP = course({
  code: '0006154050',
  name: '현장교육.실습(Ⅴ-1)',
  nameEn: '(INTERNSHIP(Ⅴ-1))',
  professor: '최승식',
  credits: 12,
  department: '컴퓨터공학부',
  schedule: ['월', '화', '수', '목', '금'].map((d) => `${d} 1 2 3 4 5 6 7 8 9 (ZZ-102)`),
})
/** 원§10.1 검증 사례: 동일 과목명 두 분반(시간 미겹침) */
export const GAME_PROG_1 = course({
  code: 'IAA6066001',
  name: '게임프로그래밍',
  nameEn: '(GAME PROGRAMMING)',
  professor: '김○○',
  department: '컴퓨터공학부',
  grade: '3',
  schedule: ['화 2 3 (ZZ-201)', '목 5 6 (ZZ-201)'],
})
export const GAME_PROG_2 = course({
  code: 'IAA6066002',
  name: '게임프로그래밍',
  nameEn: '(GAME PROGRAMMING)',
  professor: '박○○',
  department: '컴퓨터공학부',
  grade: '3',
  schedule: ['수 5 6 (ZZ-201)', '목 7 8 (ZZ-201)'],
})
/** 마감 1건 */
export const OPERATING_SYSTEMS = course({
  code: 'IAA5001001',
  name: '운영체제',
  nameEn: '(OPERATING SYSTEMS)',
  professor: '이○○',
  department: '컴퓨터공학부',
  grade: '3',
  schedule: ['월 4 5 (ZZ-202)', '수 4 5 (ZZ-202)'],
  isClosed: true,
})
/** 초기 신청내역 1건(취소 검증용) */
export const COMPUTER_NETWORKS = course({
  code: 'IAA4002001',
  name: '컴퓨터네트워크',
  nameEn: '(COMPUTER NETWORKS)',
  professor: '정○○',
  department: '컴퓨터공학부',
  grade: '3',
  schedule: ['화 7 8 (ZZ-203)', '목 2 3 (ZZ-203)'],
})

/* ---------- 교양 ---------- */
/** 원§5.5 예시 행: 태그 [75분수업] — 시간표는 75분 블록 문법(01 §3-4) */
export const CALCULUS_2 = course({
  code: '0004200102',
  name: '대학수학(2)',
  nameEn: '(CALCULUS(2))',
  professor: '최○○',
  courseType: '기초교양',
  courseArea: '기초과학ㆍ공학',
  department: '기초교육원',
  schedule: ['화 5B-6 (ZZ-301)', '목 7-8A (ZZ-301)'],
  tags: ['[75분수업]'],
})
export const WRITING = course({
  code: '0001100001',
  name: '글쓰기',
  nameEn: '(WRITING)',
  professor: '한○○',
  courseType: '기초교양',
  courseArea: '학문의기초',
  department: '기초교육원',
  schedule: ['월 2 3 (ZZ-701)'],
})
/** 온라인 강좌 — 시간표 빈 값(01 §3-4) */
export const INU_SEMINAR = course({
  code: '0002100001',
  name: 'INU세미나',
  nameEn: '(INU SEMINAR)',
  professor: '오○○',
  courseType: '핵심교양',
  courseArea: '(핵심)INU세미나',
  department: '기초교육원',
  credits: 1,
  schedule: [],
  tags: ['[e-Learning]'],
})
export const PHILOSOPHY = course({
  code: '0002100002',
  name: '철학의이해',
  nameEn: '(UNDERSTANDING PHILOSOPHY)',
  professor: '윤○○',
  courseType: '핵심교양',
  courseArea: '(핵심)인문',
  department: '기초교육원',
  schedule: ['수 2 3 (ZZ-702)'],
})
export const ENGLISH_CONVERSATION = course({
  code: '0002300001',
  name: '실용영어회화',
  nameEn: '(PRACTICAL ENGLISH CONVERSATION)',
  professor: '장○○',
  courseType: '심화교양',
  courseArea: '외국어',
  department: '기초교육원',
  schedule: ['금 3 4 (ZZ-703)'],
})
export const TEACHING_PRACTICE = course({
  code: '0005000001',
  name: '교직실무',
  nameEn: '(TEACHING PRACTICE)',
  professor: '서○○',
  courseType: '교직',
  department: '사범대학',
  schedule: ['금 1 2 (ZZ-704)'],
})
export const MILITARY_SCIENCE = course({
  code: '0007000001',
  name: '군사학개론',
  nameEn: '(INTRODUCTION TO MILITARY SCIENCE)',
  professor: '강○○',
  courseType: '군사학',
  department: '군사학과',
  schedule: ['월 8 9 (ZZ-705)'],
})
export const STARTUP_BASICS = course({
  code: '0008000001',
  name: '창업의이해',
  nameEn: '(UNDERSTANDING STARTUPS)',
  professor: '문○○',
  courseType: '일반선택',
  department: '창업지원단',
  schedule: ['화 8 9 (ZZ-706)'],
})

/* ---------- 타학과 ---------- */
/** 원§10.2 예시: 경영학부 개설 → 컴퓨터공학부 학생 신청 시 resolvedType 일반선택 */
export const BUSINESS_PROG_2 = course({
  code: '0012410001',
  name: '경영프로그래밍2',
  nameEn: '(BUSINESS PROGRAMMING 2)',
  professor: '이○○',
  department: '경영학부',
  grade: '2',
  schedule: ['월 6 7 (ZZ-401)', '수 6 7 (ZZ-401)'],
})
export const ACCOUNTING = course({
  code: '0012300001',
  name: '회계원리',
  nameEn: '(PRINCIPLES OF ACCOUNTING)',
  professor: '송○○',
  department: '경영학부',
  grade: '1',
  schedule: ['화 4 5 (ZZ-402)', '목 4 5 (ZZ-402)'],
})
/** 야간학과 1건 → 행 brown */
export const ECONOMICS_NIGHT = course({
  code: '0021100001',
  name: '경제학원론',
  nameEn: '(PRINCIPLES OF ECONOMICS)',
  professor: '조○○',
  department: '경제학과(야)',
  grade: '1',
  schedule: ['월 10 11 (ZZ-501)', '수 10 11 (ZZ-501)'],
  isNight: true,
})
export const DATA_MINING = course({
  code: '0033100001',
  name: '데이터마이닝',
  nameEn: '(DATA MINING)',
  professor: '배○○',
  department: '데이터과학과',
  grade: '3',
  schedule: ['화 4 5 (ZZ-601)', '목 4 5 (ZZ-601)'],
  tags: ['[온라인혼합형강좌]'],
})

/* ---------- HUSS ---------- */
export const HUSS_CITIZENSHIP = course({
  code: 'HUS1001001',
  name: '포용사회와시민',
  nameEn: '(INCLUSIVE SOCIETY AND CITIZENSHIP)',
  professor: '신○○',
  department: 'HUSS포용사회이니셔티브학부',
  schedule: ['화 1 2 (ZZ-801)'],
})
export const HUSS_INNOVATION = course({
  code: 'HUS1002001',
  name: '사회혁신프로젝트',
  nameEn: '(SOCIAL INNOVATION PROJECT)',
  professor: '임○○',
  department: 'HUSS포용사회이니셔티브학부',
  schedule: ['목 1 2 (ZZ-802)'],
})

/* ---------- 연계전공 ---------- */
export const AI_INTRO = course({
  code: 'YAI1001001',
  name: '인공지능개론',
  nameEn: '(INTRODUCTION TO ARTIFICIAL INTELLIGENCE)',
  professor: '권○○',
  department: '컴퓨터공학부',
  grade: '2',
  schedule: ['월 4 5 (ZZ-901)'],
})
export const ML_BASICS = course({
  code: 'YAI1002001',
  name: '머신러닝기초',
  nameEn: '(MACHINE LEARNING BASICS)',
  professor: '배○○',
  department: '데이터과학과',
  grade: '3',
  schedule: ['수 8 9 (ZZ-902)'],
})
export const SOCIAL_DATA = course({
  code: 'YSD1001001',
  name: '소셜데이터분석',
  nameEn: '(SOCIAL DATA ANALYSIS)',
  professor: '류○○',
  department: '미디어커뮤니케이션학과',
  grade: '3',
  schedule: ['금 5 6 (ZZ-903)'],
})

/* ---------- 화면별 목록 ---------- */
/** O-3 전공과목(컴퓨터공학부) — 예시 행 + 동일과목명 2분반 + 마감 1 */
export const JUNGONG_COURSES: readonly Course[] = [
  INTERNSHIP,
  GAME_PROG_1,
  GAME_PROG_2,
  OPERATING_SYSTEMS,
  COMPUTER_NETWORKS,
]
/** O-2 장바구니 */
export const BASKET_COURSES: readonly Course[] = [CALCULUS_2, GAME_PROG_1, BUSINESS_PROG_2]
/** O-7 HUSS */
export const HUSS_COURSES: readonly Course[] = [HUSS_CITIZENSHIP, HUSS_INNOVATION]
/** O-4 교양(이수구분·이수영역으로 필터) */
export const GYOYANG_COURSES: readonly Course[] = [
  CALCULUS_2,
  WRITING,
  INU_SEMINAR,
  PHILOSOPHY,
  ENGLISH_CONVERSATION,
  TEACHING_PRACTICE,
  MILITARY_SCIENCE,
  STARTUP_BASICS,
]
/** O-6 연계전공 — 키는 02 §5-3 이름(코드값 미제공, Q-14) */
export const YUNGAE_COURSES: Readonly<Record<string, readonly Course[]>> = {
  인공지능소프트웨어연계전공: [AI_INTRO, ML_BASICS],
  소셜데이터사이언스연계전공: [SOCIAL_DATA],
}
/** O-5(학과 필터)·O-8(검색) 대상 전체 — id 유일 */
export const ALL_COURSES: readonly Course[] = [
  ...JUNGONG_COURSES,
  ...BASKET_COURSES,
  ...HUSS_COURSES,
  ...GYOYANG_COURSES,
  ...Object.values(YUNGAE_COURSES).flat(),
  ACCOUNTING,
  ECONOMICS_NIGHT,
  DATA_MINING,
].filter((c, i, arr) => arr.findIndex((o) => o.id === c.id) === i)

/** 초기 신청내역(취소 검증용, D22) */
export const INITIAL_ENROLLED_COURSES: readonly Course[] = [COMPUTER_NETWORKS]
