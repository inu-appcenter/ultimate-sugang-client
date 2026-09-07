# 03 — 프론트엔드 명세 (Frontend Spec) — 하네스 소유 계획 문서

> **출처**: 하네스(harness-init, 2026-09-06)가 `01`·`02`·`04`·`05` 와 `rules/` 를 근거로 작성. **창작이 허용되는 유일한 계획 문서**(단, 엔드포인트/필드/화면 창작은 여기서도 금지 — 계약 gap 은 어댑터로 격리만 한다).
> **관할**: 프론트 아키텍처·기술 스택·Step 계획·횡단정책. **§2 문서 정합성 노트 = 충돌 해소 결정**(`rules/decisions.md` D-n 과 1:1).
> 인용: `03 §3-2`.

---

## §1. 기술 스택 (하네스 기본 + 이 프로젝트의 확정 편차)

| 영역 | 채택 | 편차/근거 |
|---|---|---|
| 빌드/언어 | Vite 8 + **React 19** + TypeScript 6(strict, 단일 `tsconfig.json`) | **D37·D38**(2026-09-06) |
| 폰트 | `@fontsource/nanum-gothic`(OFL) 400/700 자체 호스팅 — Dotum/Gulim 부재 환경 폴백 | **D36**(D18 대체) |
| 스타일 | **Tailwind CSS(레이아웃 보조) + 원본 CSS 이식(`globals.css`, 토큰 var())** | **shadcn/ui 미도입** — `01 §1` 재현 대상 = DOM 구조·CSS. 원본 클래스명(`perT`·`dataT`·`btn_blue`…)을 그대로 쓴다 → **D2** |
| 컴포넌트 | 시맨틱 HTML(`<table>`·네이티브 `<select>`·`<button>`) | 명세 원§1 "순수 table", 원§5.8 조회 버튼은 `<button>` 대체, `<font>` → `span.th-en` → D2 |
| 다이얼로그 | **`window.alert` / `window.confirm`** | 원§9.2 지시. sonner·shadcn Dialog 미사용 → D2 |
| 서버 상태 | TanStack Query v5 | 기본. `refetchOnWindowFocus:false`, 도메인 queryKey 팩토리 |
| 클라이언트 상태 | Zustand(세션 식별 1개 스토어) | 검색 조건은 화면 로컬 state |
| 폼 | React Hook Form + Zod(`zodResolver`) — `LOGIN`(학번), `CUSTOM`(2자 이상) | 그 외 화면은 select 만이라 RHF 불필요 |
| HTTP | axios(`http` 어댑터 전용 인스턴스) | 기본. 계약 미제공 → 어댑터 뒤로 격리(D1) |
| 라우팅 | react-router-dom v6 (`createBrowserRouter`) | `/`, `/sukang` → D7 |
| 날짜 | date-fns | 표시용 날짜 없음 — 서버 시간 오프셋 유틸에만 |
| 아이콘 | 없음(lucide 미설치) | 원본에 아이콘 없음(`04 §6`) |
| 테스트 | Playwright(QA Step) | `.claude/resource/smoke/` |
| 금지 | CSS-in-JS·Formik·RTK·SWR·moment/dayjs·shadcn/ui·sonner | `rules/antipatterns.md` + D2 |

---

## §2. 문서 정합성 노트 (분석 중 발견한 모순·gap 과 해소) — `rules/decisions.md` 와 동기

| # | 충돌/gap | 해소 | D |
|---|---|---|---|
| N-1 | 명세는 "서버·API 별도 존재"(원§0)라 하나 엔드포인트·응답 형태가 전혀 없음(원부록 "미조사") | **어댑터 인터페이스** 뒤에 데이터 접근을 격리. 기본 `mock` 어댑터(인메모리 픽스처 + 지연 + 서버 검증 시뮬레이션)로 전 화면 구현. 실 계약 도착 시 `http` 어댑터만 추가. **엔드포인트 창작 없음** | D1 |
| N-2 | 하네스 기본(shadcn/ui·sonner·모달 ESC/외부클릭) vs 명세의 원본 CSS/DOM 재현·네이티브 alert/confirm(원§0·§5·§6·§9.2) | **명세 우선.** shadcn/sonner 미도입, 원본 CSS 를 토큰 var() 로 치환해 `globals.css` 에 이식, 컴포넌트는 원본 클래스명 사용 | D2 |
| N-3 | 원§9.1 CAPTCHA 상세 vs 원§9.1 "넣지 않는 것을 권장" | 미구현(원문은 `01 부록 A` 보존) | D3 |
| N-4 | 원§10.3 "원본 UX 결함(신청 후 조회목록 미갱신·0건 안내 없음)" + 원§12 "정원 컬럼 없음" — "그대로 갈지 개선할지 결정 필요" | 기본값 **원본 그대로**(연습 체감 동일). 사용자 답변으로 변경 가능(Q-3) | D4 |
| N-5 | 원문 오탈자(`registrered`·`가능 합니다`·`신청 하였습니다`·`잘 못`) "재현 여부 선택" | **그대로 재현** | D5 |
| N-6 | 원§9.3 미확보 메시지(명세 자체 제안) + `TIMEOUT`/알 수 없는 오류 메시지 부재 | 원§9.3 제안 채택. TIMEOUT/알 수 없는 오류는 하네스가 같은 톤으로 1건 작성(§5-3) | D6 |
| N-7 | 원본 iframe 셸 + JSP vs 원§1 주석 "단일 페이지로 만들어도 됨" + 원§3 JSX 예시 | 단일 SPA. 라우트 `/`(LOGIN) · `/sukang?menu={Key}`(메인) | D7 |
| N-8 | 뷰포트/테마 미기재. CSS `.wrap{width:80%;min-width:1400px}`, Chrome/Edge 전용 | 데스크탑 전용(`min-width:1400px` 래퍼, 80% 폭), 라이트 전용, 반응형·다크 코드 금지 | D8 |
| N-9 | 하네스 "4상태(Loading skeleton)" vs 원본에 로딩 시각 없음·0건 안내 없음 | 4상태를 **원본 시각 안에서** 정의(§5-4): Loading=헤더만+조회버튼 disabled, Error=alert+헤더만, Empty=헤더만, Data=행 | D9 |
| N-10 | 원§3 컬럼 폭 px(50/70/80/543…) vs 하네스 "매직 px 금지" | 컬럼 폭은 **화면 설정 데이터**(`columns.ts`, `<colgroup>` 로 적용, 근거 원§3) — 디자인 토큰 대상 아님 | D10 |
| N-11 | 연습용 배너 "고정 노출" — 위치·스타일 미기재 | `.wrap` 최상단(perT 위) 1줄, `.noti em` 스타일(maroon 굵게 11px). Q-10 | D11 |
| N-12 | 로고 CI 플레이스홀더 + "자체 명칭" — 명칭 미기재 | 텍스트 `[LOGO]` 플레이스홀더 + `수강신청 연습 사이트 (비공식 Mock)`. Q-10 | D12 |
| N-13 | 원§7 토큰 목록에 없는 색이 원§6 CSS·원§8.6·원§5.5 에 존재(`#CBCBCB` `#CFCFCF` `#616161` `#1958A8` `#EFF5FC` `blue` `.timeT` 색) | `04 §1-2` 에 **보충 토큰**으로 추가(출처 표기). 토큰명은 원§7 이름 그대로(shadcn 부재로 충돌 없음), Tailwind 별칭 `body`/`line` 만 가독성용 | D13 |
| N-14 | 원§0 "인증/세션 재현 안 함" vs 학적 정보 표시·원§12 "세션 만료" | 세션 = **표시용 학번 1개**(Zustand + `sessionStorage`). 미로그인 `/sukang` 접근 → `/`. `SESSION_EXPIRED` → alert 후 `/` (Q-13) | D14 |
| N-15 | 하네스 "편집 화면 이탈 보호" | 편집/dirty 화면 없음 → 미적용 | D15 |
| N-16 | 원§12 "서버 시간 동기화 — 연습의 핵심" 이나 표시 UI 없음 | `Date` 헤더 오프셋 유틸(`shared/api/serverTime.ts`)만. UI 는 Q-13 답변 시 | D16 |
| N-17 | 탭 활성 스타일·행 hover 색(`listColorOn/Off`) 값 부재 | 미구현(원본 CSS 근거 없음). Q-12 | D17 |
| N-18 | Dotum/Gulim 은 Windows 번들 폰트 — 웹폰트 라이선스 불명 | 폰트 스택 원문 그대로, 웹폰트 미도입. Q-15 | D18 |
| N-19 | 검색 조건 미충족 시 동작·로그인 빈 값·`찾기` 링크·바로가기 4개 동작 미기재 | 미충족 → 요청 안 보냄·메시지 없음 / 빈 학번 → 진입 안 함 / 링크·바로가기 → 렌더만(no-op). Q-7·Q-9 | D19 |
| N-20 | 초기 탭 미기재 | `Basket`(첫 탭). Q-8 | D20 |
| N-21 | 헤더 en 라벨 누락(요일 및 교시·액션) | 한글만. 액션 헤더 `신청`/`취소`. Q-11 | D21 |
| N-22 | 시드 데이터 없음 | 명세 예시 행(현장교육.실습·대학수학(2)·게임프로그래밍 ×2·경영프로그래밍2) + 화면당 소량 픽스처. 학생 = 명세 예시. Q-2 | D22 |
| N-23 | 원§4.3 "`~전공(연계)` 6개" vs 목록상 5개 | 목록 32개를 권위(`02 §5-3`) | (기록만) |
| N-24 | 원§2.1 "결과 컬럼 수" ↔ 원§3 매트릭스 합계 | 일치 확인(10/10/9/9/8/9/10, 신청내역 11) — 충돌 없음 | — |
| N-25 | Q-5 출력 화면 내용 없음 | 화면 미구현, 버튼 렌더 + alert `연습 사이트에서는 지원하지 않습니다.` | D23 |
| N-26 | Q-6 대기열 | 최후순위 이관, 재논의 전 `WAITING_ROOM` SKIPPED | D24 |
| N-27 | Q-1 계약 | 프론트 mock → API Spec 도출 → 서버 수정. http 착수 금지 | D25 |
| N-28 | Q-2 시드 | `intake/INU-시드데이터.md` 74건 교체. 교양 개설학과 `교양`/`일선`, 부서명 교강사, 실제 건물번호 | D26 |
| N-29 | 원어여부 필드 | `Course.isEnglish` → `EN(원어)` | D27 |
| N-30 | 이수구분 enum | 관측 8종 확정 | D28 |
| N-31 | CAPTCHA | 로직 구현, `VITE_CAPTCHA` 기본 off, `useCaptchaGate`(beforeSubmit) | D34 |
| N-32 | 초기 탭 | 랜딩 상태(제목·결과 테이블 없음, 전공과목 안내만) | D35(D20 대체) |
| N-33 | 행 hover·웹폰트·로그인 중앙 | hover `--row-hover` 구현 · Nanum Gothic 웹폰트 · `#login` transform 중앙 | D36 |
| N-34 | preflight box-sizing | `.sch_areaT`(+`.sch_areaSubT`·`.leftT`) `content-box` 명시 | D40 |
| N-35 | 초기 신청내역 | 0건 | D43 |
| N-36 | 커밋 정책 | 게이트별 자동 커밋 중단 — 전 작업 완료 후 승인받아 일괄 | D48 |

---

## §3. 데이터 접근 계층 (계약 gap 격리)

### §3-1. 원칙
- 화면·훅은 **`features/sukang/api.ts` 만** 호출한다. 그 뒤에 어댑터(`mock` | `http`)가 있다. 어댑터 선택은 `VITE_API_ADAPTER`(§8).
- **모든 어댑터 출력은 `schemas.ts` 의 Zod 스키마로 parse** 한 뒤 사용(mock 도 예외 없음 — 픽스처 오염 방지).
- 어댑터 오류는 `SukangError { code: SukangErrorCode; message }` 로 정규화. 코드 = `02 §4-3`.
- `http` 어댑터는 **계약(Q-1) 도착 전에는 구현하지 않는다**(파일은 `NOT_CONFIGURED` 를 던지는 스텁만).

### §3-2. 어댑터 인터페이스 (`features/sukang/api/types.ts`) — `02 §3` O-1~O-11 과 1:1
```ts
export interface SukangApi {
  getStudent(studentId: string): Promise<Student>;                                  // O-1
  listBasket(studentId: string): Promise<Course[]>;                                 // O-2
  listJungong(studentId: string): Promise<Course[]>;                                // O-3
  listGyoyang(p: { cptnGbn: string; fldGnb?: string }): Promise<Course[]>;          // O-4
  listTagwa(p: { tagwaCd: string }): Promise<Course[]>;                             // O-5
  listYungae(p: { yungaeCd: string }): Promise<Course[]>;                           // O-6
  listHuss(): Promise<Course[]>;                                                    // O-7
  searchCourses(p: { q: string }): Promise<Course[]>;                               // O-8
  listEnrollments(studentId: string): Promise<EnrollmentRow[]>;                     // O-9 (Enrollment + course 내장)
  enroll(p: { studentId: string; courseId: string }): Promise<{ course: Course }>;  // O-10 (성공 메시지에 교과목명 필요)
  cancel(p: { studentId: string; courseId: string }): Promise<void>;                // O-11
}
// O-12~14: D23(출력 = 버튼 alert, 오퍼레이션 없음) · D24(대기열 최후순위) — 인터페이스에 추가하지 않는다.
// 이 인터페이스 + 02 §2 모델이 추후 도출할 API Spec 의 기준(D25).
```
- `EnrollmentRow = Enrollment & { course: Course }` — 신청내역 11컬럼 렌더용 조인(`02 §2-2` 주석; 실 계약이 별도 조회면 http 어댑터가 조인).
- 스키마: `StudentSchema`·`CourseSchema`·`EnrollmentSchema`·`EnrollmentRowSchema` + 배열. `z.infer` 로 타입.

### §3-3. mock 어댑터 (`features/sukang/api/mock/`) — 기본값 D1
- `fixtures.ts`: **`intake/INU-시드데이터.md` 관측 74건(유일 72) 그대로**(D26 — 임의 픽스처 금지). `※부분` 항목만 시드 §10 가이드로 보완(주석 표기). 초기 신청내역 **0건**(D43). 학생 = 시드 기준 학생 + gpa 고정값(3.2) → `creditLimit` 산출(D26). 연계전공 관측 없음 → 빈 결과.
- `mockApi.ts`: 인메모리 상태(신청내역). 모든 호출에 `delay(200~800ms)`(원§12).
- `validate.ts`: 서버 검증 시뮬레이션 — 순서 `02 §4-1`(D41): 시간표 중복→`DUP_TIME` → 동일 과목명→`DUP_SUBJECT`(`name` 동일, 독립) → 학점 합 > `creditLimit`→`CREDIT_EXCEEDED` → `isClosed`→`CLASS_FULL`. 시간표는 **반교시 단위**(`1-2A` 와 `2B-3` 은 안 겹침 — 시드 §2.4 교차 배치) 슬롯으로 비교, 야간 `야N` 별도. `resolvedType` = 시드 §8 근사(D42): 개설학과 == 소속 → 유지 / 전공 계열 → `일반선택` / 그 외 유지. **실 규칙은 백엔드 소관(코드 주석 명시).** `creditLimit` = gpa 기반 20/21/24(D26).
- CAPTCHA 게이트(D34): `features/sukang/captcha/` — `useCaptchaGate()` 가 신청 실행을 `beforeSubmit` 형태로 감싼다. `VITE_CAPTCHA=off`(기본)면 즉시 실행, `on` 이면 `CaptchaModal`(01 부록 A 문구, 05 §10) → 정답 시 보류 요청 실행, 오답 10회 → logout.
- 실패율·대기열·서버 시계는 **시뮬레이션하지 않는다**(백엔드 범위, `02 §6`). 옵션 env 로 `SESSION_EXPIRED` 강제 발생 스위치 1개만(`VITE_MOCK_FAIL=session`, 신청/취소에만 적용 D44) 두어 Q-13 흐름을 수동 검증 가능하게 한다.

### §3-4. http 어댑터 (`features/sukang/api/httpApi.ts`) — **D25: 착수 금지**(계약은 프론트 mock 에서 도출 후 서버가 맞춘다)
- `shared/api/client.ts` 의 axios 인스턴스 사용. 응답 → Zod parse → 실패 시 `SukangError('SCHEMA')`. `Date` 헤더 → `serverTime.setOffsetFromDateHeader()`.
- 타임아웃 → `TIMEOUT`. 인증 헤더·재발급 큐 **없음**(`02 §1` 인증 없음).

---

## §4. 디렉토리 구조 (`rules/architecture.md` 준수 — 단방향: app → pages → features → shared)
```
src/
  app/
    main.tsx                 진입(globals.css import, Providers, RouterProvider)
    App.tsx
    providers.tsx            QueryClientProvider(refetchOnWindowFocus:false, retry:0)
    router.tsx               '/' LoginPage · '/sukang' RequireSession(SukangPage)
  pages/
    LoginPage.tsx            얇음: <LoginBox/>
    SukangPage.tsx           얇음: <SukangShell/> (menu 쿼리 → 화면 스위치)
  features/
    login/
      schemas.ts             LoginFormSchema { studentId: string().min(1) }
      constants.ts           로그인 텍스트(01 §7)
      components/LoginBox.tsx
    sukang/
      schemas.ts             Student/Course/Enrollment/EnrollmentRow (+배열)
      api.ts                 sukangApi = parse(adapter.*) 래퍼
      api/types.ts           SukangApi 인터페이스, SukangError, SukangErrorCode
      api/index.ts           getAdapter(): env 에 따라 mock|http
      api/mock/{mockApi,fixtures,validate}.ts
      api/httpApi.ts         스텁(NOT_CONFIGURED)
      queryKeys.ts           sukangKeys.student/courses(screen,params)/enrollments
      hooks.ts               useStudent, useCourseList(screen, params, enabled), useEnrollments, useEnroll, useCancel
      columns.ts             SCREEN_COLUMNS[ScreenKey] + ENROLLMENT_COLUMNS (컬럼 정의·폭·라벨 ko/en) — D10
      errors.ts              reportSukangError: alert + SESSION_EXPIRED → logout (03 §5-2)
      captcha/               D34: useCaptchaGate.ts(beforeSubmit) · CaptchaModal.tsx · generateCaptcha.ts(4자리+노이즈 canvas) · texts.ts(01 부록 A 원문)
      constants/
        screens.ts           ScreenKey('Basket'…'Custom'), 탭 라벨 ko/en, 화면 제목(>>), 검색 패턴
        notices.ts           화면별 안내 문구 전문(01 §4)
        messages.ts          메시지 카탈로그(02 §4-3) + TIMEOUT/UNKNOWN(D6)
        codes.ts             교양 트리·타학과 76·연계전공 32·placeholder(02 §5)
      components/
        SukangShell.tsx      전체 골격(05 §1 순서)
        PracticeBanner 는 shared
        PerTable.tsx         .perT
        MenuTabs.tsx         a.btn_re ×7 + 주의문구
        ScreenTitle.tsx      >> 제목 + 검색 슬롯 + 조회 버튼
        ScreenNotice.tsx     안내 영역
        SearchNone/SearchSelect/SearchLinkedSelect/SearchText.tsx
        ResultArea.tsx       .sch_areaT 래퍼(aria-busy)
        CourseTable.tsx      .dataT (columns 주입) + 행 색 + 액션 셀
        CourseTitleCell.tsx  교과목명 셀(01 §3-3)
        ActionButton.tsx     btn_blue/btn_grey2/btn_red
        EnrollmentArea.tsx   regi_area: 헤더 문구 + PrintButtons + EnrollmentTable
        EnrollmentTable.tsx
        PrintButtons.tsx     렌더만(Q-5 전 동작 없음)
      screens/
        BasketScreen.tsx JungongScreen.tsx GyoyangScreen.tsx TagwaScreen.tsx
        YungaeScreen.tsx HussScreen.tsx CustomScreen.tsx
        LandingScreen.tsx      D35 랜딩(제목·결과 테이블 없음, 전공과목 안내만)
  shared/
    api/client.ts            axios 인스턴스 팩토리(baseURL·timeout)
    api/delay.ts             randomDelay(min,max)
    api/serverTime.ts        Date 헤더 오프셋(D16)
    session/store.ts         zustand: studentId | null, login(id), logout() — sessionStorage persist (D14)
    config/env.ts            import.meta.env Zod parse: VITE_API_ADAPTER('mock'|'http'), VITE_API_BASE_URL?, VITE_MOCK_FAIL?
    constants/routes.ts      ROUTES.login='/', ROUTES.sukang='/sukang', MENU_QUERY='menu'
    constants/appText.ts     배너 문구·앱 명칭(D11·D12)
    constants/fieldLimits.ts CUSTOM_QUERY_MIN_LEN = 2
    lib/cn.ts                clsx + tailwind-merge
    lib/dialog.ts            alert(msg)/confirm(msg) 래퍼(window.* 위임 — 테스트 대체용)
    components/ThEn.tsx      <span class="th-en">
    components/PracticeBanner.tsx
    components/RequireSession.tsx
    styles/globals.css       토큰(CSS 변수) + 원본 CSS 이식(04 §4)
```
- `features/login` ↔ `features/sukang` 상호 import 금지. 세션은 `shared/session`.
- import 는 `@/` alias 만. 파일 네이밍 규칙 `rules/architecture.md`.

---

## §5. 횡단 정책

### §5-1. 세션 식별 (인증 아님 — D14)
- LOGIN 에서 학번 입력 → `session.login(id)` → `/sukang`. `RequireSession` 은 `studentId` 없으면 `/` 로 `<Navigate replace>`.
- `sessionStorage` persist(탭 닫으면 소멸). 토큰·쿠키·재발급 없음.
- `SESSION_EXPIRED` 수신 → `alert(메시지)` → `session.logout()` → `/`.

### §5-2. 에러 → 메시지 (`shared/lib/dialog.ts` 경유, 전부 native)
1. `SukangError.code` 가 카탈로그(`messages.ts`)에 있으면 그 문구.
2. `TIMEOUT` → `요청 시간이 초과되었습니다. 다시 시도하세요.\n Request timed out.` (하네스 작성, D6)
3. 그 외 → `요청 처리 중 오류가 발생했습니다.\n Request failed.` (하네스 작성, D6)
- 토스트 없음. 성공도 alert(`ENROLL_OK`·`CANCEL_OK`).

### §5-3. 메시지 포맷 불변
`한글` + `\n` + 공백 1칸 + `영문`. `{교과목명}` 치환은 `Course.name`(태그 제외). 오탈자 원문 유지(D5).

### §5-4. 4상태 렌더 정책 (D9) — 원본 시각을 벗어나지 않게
| 상태 | 결과 영역(`.sch_areaT > .dataT`) | 부가 |
|---|---|---|
| Loading | 헤더만 렌더, tbody 비움 | `.sch_areaT[aria-busy=true]`; 조건 화면은 [조회] `disabled`(시각 변화 없음) |
| Error | 헤더만 | `alert(메시지)` 1회(요청당) |
| Empty | 헤더만, **안내 문구 없음** | 원§10.3 |
| Data | 행 렌더 | 행 색(grey/brown), 액션 셀 |
- 신청/취소 진행 중: 같은 행 재클릭 무시(`isPending` 가드, 시각 변화 없음 — 원본 버튼에 disabled 스타일 없음).
- Loading 은 "데이터 없음 + fetching" 일 때만(D45). 같은 조건 재조회·invalidate 중에는 기존 행 유지.
- 행 hover: `.dataT tbody tr:hover` 배경 `--row-hover`(D36, 원 `listColorOn/Off` 대응). 탭 활성 강조는 없음(D17 유지).
- 신청 성공 → `enrollments` 키만 invalidate. **`courses` 키는 invalidate 하지 않는다**(D4 미갱신). 취소 성공 → `enrollments` invalidate.

### §5-5. 조회 트리거 패턴
- 조건 없음 화면: `useCourseList(screen, {}, enabled: true)` — 탭 진입 즉시.
- 조건 있는 화면: 로컬 `submitted` state. [조회] 클릭 → 조건 검증(D19: 미충족이면 no-op) → `submitted` 갱신, 동일 조건이면 `invalidateQueries(key)`. 쿼리 `enabled: submitted !== null`.
- 탭 전환 시 이전 화면의 검색 조건·결과는 유지하지 않아도 된다(명세 없음 — 언마운트로 초기화, 캐시는 Query 기본 gcTime).

### §5-6. 폼
- RHF + zodResolver. LOGIN: `studentId` `min(1)`(D19 — 빈 값 진입 불가, 메시지 없음). CUSTOM: `q` `min(2)`(원§8.6, `fieldLimits.CUSTOM_QUERY_MIN_LEN`). 검증 실패 시 **메시지 없이 제출 무시**(D19). onChange 검증 없음.

### §5-7. 이탈 보호
- 없음(D15).

### §5-8. 라우팅·URL
- `/` LOGIN · `/sukang?menu=Basket|Jungong|Gyoyang|Tagwa|Yungae|Huss|Custom`(없거나 무효 → **랜딩 상태** `LandingScreen`, D35). 탭 클릭 = `setSearchParams({menu})`.
- 출력 버튼: 클릭 → `alert(MESSAGES.PRINT_UNSUPPORTED)`(D23). 시각 원문 유지, 비활성 처리 금지.

### §5-9. 접근성·마크업 충실도
- `th[scope]` 원본대로(`.titY` 만 `col`, 나머지 라벨 `row`; dataT 헤더 `col`). `table.dataT[summary]` 는 HTML5 비표준이므로 `aria-label` 로 대체(05 §4).
- 영문 라벨 `<span class="th-en">`(D2; `<font size=1 color=#16529B>` 대체, 10px·blue-en).

---

## §6. Step 계획 (`build-state.json.checklist` 와 1:1 — id 컨벤션: 비리뷰 `step-N-이름`, 화면 `step-N:SCREEN_ID`)

| Step | 항목 id | 내용 | phase 파일 |
|---|---|---|---|
| 1 | `step-1-setup` | 스캐폴드·토큰·globals.css 이식·alias·env·폴더·빈 라우트 | `step-1-setup.md` |
| 2 | `step-2-infra` | 스키마·어댑터(mock)·훅·queryKeys·세션·상수(codes/notices/messages/columns)·공용 컴포넌트(ThEn·ActionButton·CourseTable 골격·dialog) | `step-2-infra.md` |
| 3 | `step-3:LOGIN` · `step-3:MAIN_SHELL` · `step-3:ENROLLMENT_LIST` | 로그인 → 메인 골격(perT·탭·주의문구·제목 라인·출력버튼 자리) → 신청내역(11컬럼 + 취소 플로우) | `step-3-shell.md` |
| 4 | `step-4:JUNGONG` · `step-4:CAPTCHA_GATE` · `step-4:HUSS` · `step-4:BASKET` | 조건 없음 3화면 + CAPTCHA 게이트(D34). **신청 플로우(alert·검증 메시지·내역 추가·미갱신)는 JUNGONG 에서 구현**하고 나머지가 재사용 | `step-4-nocond.md` |
| 5 | `step-5:TAGWA` · `step-5:YUNGAE` | 단일 select + 조회 | `step-5-select.md` |
| 6 | `step-6:GYOYANG` · `step-6:CUSTOM` | 2단 연동 select(표시 토글) · 텍스트 2자 이상 | `step-6-linked.md` |
| 7 | `step-7:PRINT_CHECK` · `step-7:PRINT_APPLY` · `step-7:WAITING_ROOM` | PRINT_* = 버튼 alert 확인(D23, Step 3 에서 구현) · WAITING_ROOM = `SKIPPED`(D24 재논의 전) | `step-7-gap.md` |
| 8 | `step-8-qa` | Playwright 스모크 + 전 화면 수동 점검 | `step-8-qa.md` |

- 각 화면 항목은 `implement-one-screen` 절차. Figma URL 없음 → `05` 기반(중단 없음).
- 사람 게이트: Step 종료마다 리뷰 패킷 → 정지. **(2026-09-06 사용자 지시: 큰 문제 없으면 정지 없이 끝까지 진행, 커밋은 마지막 일괄 D48)**

---

## §7. 셋업 체크리스트 (step-1 상세)
1. `npm create vite@latest . -- --template react-ts` (현 디렉토리, `.claude/`·`intake/` 보존). Node 18+.
2. 의존성: `react@19` `react-dom@19`(D37) `react-router-dom@6` `@tanstack/react-query` `zustand` `react-hook-form` `zod` `@hookform/resolvers` `axios` `date-fns` `clsx` `tailwind-merge` `@fontsource/nanum-gothic`(D36). dev: `tailwindcss@3 postcss autoprefixer` `@types/node` `eslint@10 flat`(하네스 훅이 eslint 호출, D38) `prettier`.
3. `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `paths: {"@/*": ["./src/*"]}` + `vite.config.ts` alias.
4. Tailwind: `content: ['./index.html','./src/**/*.{ts,tsx}']`, `theme.extend` = `04 §1` 토큰(색·폰트·크기), `borderRadius` 전부 `0`, `fontFamily.dotum`. **반응형 breakpoint·`dark:` 사용 금지**(D8).
5. `src/shared/styles/globals.css`: `@tailwind base/components/utilities` + `:root` 토큰 변수(`04 §1`) + 원본 CSS 이식(`04 §4`, hex → `var(--token)`). token-lint allow 대상 경로(`src/shared/styles/globals.css`) 그대로.
6. `index.html`: `lang="ko"`, `<title>` = 앱 명칭(D12), 뷰포트 메타 기본. 파비콘 플레이스홀더(CI 금지).
7. 폴더 §4 생성, 라우트 `/`·`/sukang` 에 `<div>LOGIN</div>`·`<div>SUKANG</div>` placeholder. `RequireSession` 은 step-2.
8. `.env.example`(§8) 생성. `.env` 는 만들지 않는다(PreToolUse 차단·사람 몫).
9. `package.json scripts`: `dev`·`build`(`tsc -b && vite build`)·`preview`·`lint`·`typecheck`(`tsc --noEmit`).
10. 게이트: `bash .claude/hooks/checks/gate-runner.sh --full` green.

## §8. env 구조 (`shared/config/env.ts`, Zod)
| 변수 | 값 | 기본 |
|---|---|---|
| `VITE_API_ADAPTER` | `mock` \| `http` | `mock`(D1) |
| `VITE_API_BASE_URL` | http 어댑터 base URL(Q-1) | 없음 — `http` 선택 시 필수 |
| `VITE_MOCK_FAIL` | `session`(SESSION_EXPIRED 강제, 신청/취소만) \| 미설정 | 미설정 |
| `VITE_CAPTCHA` | `on` \| `off` — 신청 시 CAPTCHA 모달(D34). 사용자 대면 토글 없음 | `off` |
`.env.example` 만 커밋. 실제 값은 사람이 입력.

## §9. QA 계획 (step-8)
스모크 후보(최고위험 흐름):
1. 로그인(학번 입력) → `/sukang` 진입 → perT 에 `{학번} / {성명}` 표시.
2. 전공과목 `신청` → `ENROLL_OK` alert → 신청내역 행 추가(순번 1부터) → **조회 목록의 버튼은 여전히 `신청`**(D4).
3. 동일 과목명 다른 분반 `신청` → `DUP_SUBJECT` alert(시간 미겹침 사례 `01 §6-4`).
4. 신청내역 `취소` → confirm 취소 시 무동작 / 확인 시 `CANCEL_OK` → 행 제거.
5. 교양 이수구분 `11/21/23` 선택 시 대응 이수영역 select 만 표시, `50/70/80` 은 숨김.
6. `마감` 행 클릭 → 아무 요청 없음.
7. 미로그인 `/sukang` 직접 접근 → `/` 리다이렉트.
8. 로그인 직후 랜딩 상태(D35): 제목·결과 테이블 없음, 전공과목 안내 3줄, 신청내역 헤더만.
9. 확인서출력/시간표출력 클릭 → alert `연습 사이트에서는 지원하지 않습니다.`(D23).
10. `VITE_CAPTCHA=off`(기본)에서 신청 시 모달 없음 / `on` 이면 모달 후 정답 시 신청 수행(수동).
수동 점검: 4상태(D9) 화면별, 컬럼 세트 7종 + 신청내역 11, 안내 문구 전문 일치, 배너 상시 노출, 비밀번호 필드 부재.
