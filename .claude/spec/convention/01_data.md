# convention 01 — 데이터·계약·세션

> 권위: `spec/02_api_spec.md`(계약) · `spec/01_behavior_spec.md`(동작) · `.claude/rules/decisions.md`(D1~).
> 여기는 소스에 주석으로 붙어 있던 **근거·금지사항**만 옮긴 것이다.

## §1 어댑터 경계 (`api.ts` · `api/index.ts` · `api/types.ts`)

- 화면·훅은 **`sukangApi` 하나만** 호출한다(03 §3-1). 어댑터 선택은 `getAdapter()` 가 `VITE_API_ADAPTER` 로 한다.
- **모든 어댑터 출력은 Zod parse 후 사용**한다 — mock 도 예외 없다. parse 실패는 `SukangError('SCHEMA')`.
  어댑터가 던진 `SukangError` 는 그대로 전파한다.
- `SukangApi` 인터페이스는 02 §3 의 O-1~O-11 과 1:1 이다. **O-12~O-14(출력·대기열)는 추가하지 않는다**(D23·D24).
  - O-1 `getStudent` / O-2 `listBasket` / O-3 `listJungong`(소속 기준) / O-4 `listGyoyang`(이수구분 + 이수영역 선택)
  - O-5 `listTagwa`(학과(부) 코드) / O-6 `listYungae`(연계전공 코드) / O-7 `listHuss` / O-8 `searchCourses`(2자 이상)
  - O-9 `listEnrollments`(+Course 조인) / O-10 `enroll`(성공 시 교과목 반환 — 완료 alert 에 교과목명이 필요) / O-11 `cancel`
- 에러 코드(`CATALOG_ERROR_CODES`)는 **값 추가/변경 금지**. D55 로 `NOT_IN_PERIOD` 를 제거했고
  (서버가 수강신청 기간 도메인을 만들지 않아 던지는 경로가 없다) 서버 고유 실패 3종을 추가했다:
  - `TIMEOUT` — 서버가 던지지 않는다. axios 클라이언트 타임아웃에서만 발생.
  - `COURSE_TYPE_LIMIT` — CRS-006 과목 유형 등록 제한 초과(OCU 2 · K-MOOC 1). 원본에 대응 문구 없음.
  - `NOT_REGISTERED` — REG-004 신청하지 않은 과목의 취소. `CANCEL_FAILED` — REG-005 취소 반영 실패(동시성).
- 내부 코드 `SCHEMA` · `NOT_CONFIGURED` · `SERVER` 는 전부 UNKNOWN 문구로 표시된다(D6).

## §2 도메인 모델 (`schemas.ts`)

- **Student**(02 §2-3): `grade` 는 string|number(명세 표기), `status` 는 자유 문자열 — 관측값 `유예`(D31).
  `gpa` 는 UI 비노출이고 학점 상한 산출에만 쓴다(D26: 기본 20 · 3.5↑ 21 · 4.0↑ 24). `creditLimit` 은 서버 산출값.
- **Course**(02 §2-1, 원§12 최소 스키마 + 시드 §0 정정):
  - 시드 필드명 대응 `nameKo→name` · `credit→credits`. `capacity`/`enrolled` 는 **화면 비노출**(D4 — 원본 UX 결함 재현).
  - `schedule` 은 시간표 **원문 문자열**(01 §3-4). 빈 문자열 = 온라인.
  - `nameEn` 은 괄호 없는 원문 — 표시할 때 `(영문명)` 으로 감싼다(05 §4-6).
  - `tags` 는 이름 값, 표시는 `[이름]`(D26). `isEnglish` true → 원어여부 셀 `EN(원어)`(D27).
  - `courseType` = 개설학과 기준 이수구분(조회 화면용, 01 §3-2). `courseArea` 는 교양 화면 전용, 그 외 빈 문자열.
- **Enrollment**(02 §2-2): `resolvedType` = **학생 기준 재계산 이수구분 — 서버 산출값이고 프론트는 재계산하지 않는다**(02 §4-2).
  `reAttendance` 는 신규 신청 시 빈 값. `createdAt` 은 형식 미기재라 ISO 8601 문자열(표시에 쓰지 않음).
- `EnrollmentRow = Enrollment & { course }` — 신청내역 11컬럼 렌더용 조인(03 §3-2).
- `CustomSearchFormSchema` — 과목명/학수번호 **2자 이상 70자 이하**(원§8.6 + D55 서버 상한).
  범위를 벗어나면 **메시지 없이 무시**한다(D19 no-op).

## §3 enum·코드 (`constants/codes.ts`)

- `TAGWA_LIST`(76) · `YUNGAE_LIST`(32) 는 `spec/02_api_spec.md` §5-2/§5-3 **원문 순서 그대로**(영문 → 가나다) 추출한 것이다.
  연계전공 이름 2건에 쉼표가 들어 있다 — **쉼표로 분리하지 않는다.**
- **이수구분 = 서버 확정 9종**(D55, D28 의 8종 대체). 빠져 있던 `전공핵심` 이 서버 적재분 2,436건 중 385건이라
  enum 에 없으면 전공 탭이 통째로 파싱 실패한다. 서버가 연계 API 원문을 그대로 저장하므로 값은 고정이다.
  `MAJOR_COURSE_TYPES`(전공기초·전공핵심·전공심화)는 `resolvedType` 파생 대상(시드 §8, D42).
- 교양은 **2단 트리 고정**(3단 없음). 1단 `cmbCptnGbn` 6종, 하위 이수영역은 11/21/23 에만 있다.
  select 값은 **02 §5-1 코드값**을 쓴다(D29 — 이름을 값으로 쓰지 않는다).
- `162 기초과학ㆍ공학` 의 `ㆍ` 는 **U+318D** 다(일반 가운뎃점 U+00B7 아님).
- placeholder 문자열은 원문 그대로 — `=` 개수가 select 마다 다르다(02 §5-4).
- 타학과·연계전공은 코드값 미제공이라 **이름이 곧 값**이다(D30). http 어댑터가 서버 목록으로 이름→코드를 매핑한다(§5).
- 교과목명 태그 5종은 값이 이름이고 표시는 `[이름]`(D26). HUSS 변형 2종은 시드 §6 관측분.

## §4 메시지 카탈로그 (`constants/messages.ts`)

- 포맷 고정: `한글` + `\n` + **공백 1칸** + `영문`(03 §5-3). 채널은 네이티브 `alert`/`confirm` 뿐이다(D2).
- **원문 오탈자·띄어쓰기를 그대로 재현한다**(D5) — `신청 하였습니다`, `registrered`, `가능 합니다`, (CAPTCHA) `잘 못`.
  맞춤법 교정 금지.
- `TIMEOUT` · `UNKNOWN_ERROR_MESSAGE` 는 원본에 대응이 없어 하네스가 작성했다(D6).
- D55 신규 3종(`COURSE_TYPE_LIMIT` · `NOT_REGISTERED` · `CANCEL_FAILED`)도 같은 포맷으로 하네스가 작성했다(사용자 승인 2026-09-07).
- 서버 실패 중 **원본에 대응이 있는 것은 원문 문구로 매핑**한다 — `REG-003` → `DUP_SUBJECT`, `CRS-004`(폐강) → `CLASS_FULL`.
- 표시 우선순위: ① 카탈로그 문구 → ② 그 외 전부 UNKNOWN(03 §5-2).

## §5 http 어댑터·클라이언트 (`api/httpApi.ts` · `shared/api/client.ts` · `serverTime.ts`)

**경계 원칙(D55-8): 서버 형태와 프론트 모델의 차이는 전부 `httpApi.ts` 에서 흡수한다.**
이 연동으로 화면·훅·컬럼 정의는 한 줄도 바뀌지 않았고, mock 어댑터도 그대로 남아 `VITE_API_ADAPTER` 로 되돌릴 수 있다.

흡수하는 차이 5가지:
1. 응답 래핑 벗기기 — 목록 `courseResponses` · 신청 `courseResponse` · 신청내역 `registrationCourseResponses`.
2. 파라미터 이름 — `classification-code` · `area-code` · `department` · `keyword`.
3. 신청내역 `courseId` 파생 — 서버는 `courseResponse.id` 만 준다.
4. 프로필 → `Student` 매핑 — `grade` 가 `4학년` 으로 오는데 원본 표기는 `4 / 유예` 라 **`학년` 접미를 뗀다**(D55-7).
   `academicStatus` 는 그대로 쓴다. `email` 은 쓰지 않는다.
5. 서버 에러 코드 → 프론트 카탈로그 코드.

- **학번은 요청에 싣지 않는다** — 서버가 토큰에서 학생을 판정한다(D55). 인자로 받는 `studentId` 는 queryKey 용이다.
- `REG-003`(같은 강의 재신청)은 **원본에 없는 개념**이다(D56-4). 원본 검증 순서가 시간표 중복 → 동일 과목명이라
  같은 강의를 다시 신청하면 시간표가 100% 겹쳐 `Duplicated time table.` 이, 온라인 강좌만 `Duplicated Subject.` 가 뜬다.
  서버에 **REG-003 검사를 두 검사 뒤로 옮겨 달라고 요청**했고, 반영되면 이 코드는 도달 불가가 된다.
  그때까지 안전망으로 `DUP_SUBJECT` 매핑을 남겨 둔다 — 순서 변경이 거절되면 강의 `schedule` 유무로 갈라야 한다(권장하지 않음).
- 매핑표에 없는 코드(GLB-* · MEM-* · CRS-001/002/003 · CART-*)는 `SERVER` → UNKNOWN 문구가 된다.
- **이름 → 코드 매핑(D55-4)**: select 에 **보이는** 목록은 원본 실측값(타학과 76 · 연계전공 32)을 그대로 쓰고,
  서버 목록 API(`/courses/departments` · `/courses/interdisciplinary-majors`)는 요청 파라미터를 코드로 바꾸는
  매핑표로만 쓴다. 코드가 없는 항목을 고르면 요청을 보내지 않고 빈 결과 = 원본의 0건 화면과 같다.
  매핑 로드는 실패한 조회를 캐시에 남기지 않는 1회성 메모이제이션이다.
- **장바구니 담기/빼기 API 는 붙이지 않는다**(D55-5) — 원본에 없는 UI 를 만들지 않는다. 조회만 한다.
- 인증 헤더는 `access-token` 이고 **`Bearer` 접두사를 붙이지 않는다**(D55).
- 401 → `/auth/re-issue` **단일비행 재발급** 후 원요청 **1회만** 재시도. 재발급 실패 시 원래 401 을 던져
  `SESSION_EXPIRED` 로 이어진다. 공개 경로(`/auth/*`)는 토큰도 재발급도 시도하지 않는다.
- 응답 `Date` 헤더 → 서버 시간 오프셋(D16·D32). **표시 UI 는 없다**(유틸만). CORS `exposedHeaders` 에 노출돼 있어야 읽힌다.
- 기본 타임아웃 10초. 서버는 지연·실패를 인위적으로 시뮬레이션하지 않는다(D55-6 — 성능 측정 오염 방지).
- `VITE_API_BASE_URL` 은 서버 기본 경로 `/api/v1` 까지 포함해 적는다.

## §6 세션 (`shared/session/store.ts`)

- 세션 = **표시용 학번 + (http 어댑터일 때) access token**. `sessionStorage` persist 라 탭을 닫으면 소멸한다(03 §5-1).
- D14 는 "인증 없음"이었으나 **D55 로 개정**: 서버가 JWT 를 유지하고(학번 unique 제약 + 조작 방지)
  로그인은 **학번 + 비밀번호**다. mock 어댑터에는 인증이 없어 `accessToken` 이 null 이고 학번만으로 진입한다.
- `captchaFails`(D34): CAPTCHA 오류 **누적** 횟수 — 세션 범위라 탭 전환·화면 리마운트와 무관하고
  로그인/로그아웃 시 0 으로 돌아간다. 정답을 맞혀도 초기화하지 않는다.
- 미로그인 상태로 `/sukang` 에 들어오면 `RequireSession` 이 `/` 로 replace 한다 — 인증이 아니라 식별자 유무만 본다.

## §7 쿼리 훅 (`hooks.ts` · `queryKeys.ts`)

- **신청·취소 성공 시 `enrollments` 만 invalidate 한다. `courses`(조회 목록)는 갱신하지 않는다**(D4·D33).
  원본 UX 결함을 그대로 재현하는 부분이라 "개선"하면 안 된다 — 신청 후에도 버튼이 `신청` 으로 남는 게 정답이다.
- 조회 트리거(03 §5-5): 조건 없음 화면은 `params = {}` 로 즉시, 조건 있는 화면은 [조회] 후 `submitted` 를 넘긴다.
  `params === null` 이면 요청하지 않는다(D19 미충족 no-op 와 결합).
- 같은 조건으로 다시 [조회] 하면 `submitted` 가 안 바뀌므로 해당 키를 invalidate 해 재조회한다.
  조건 미충족 판단은 **화면이 호출 전에** 한다.
- window focus refetch 는 비활성(`app/providers.tsx`), retry 0.

## §8 env·상한 (`shared/config/env.ts` · `shared/constants/fieldLimits.ts`)

- 03 §8 env 구조. 실제 값은 `.env`(사람 입력, 커밋 금지) — 코드는 파싱·기본값·필수 검증만 한다.
  빈 문자열은 미설정으로 취급한다(`.env.example` 의 `KEY=` 형태).
- `VITE_API_ADAPTER` = `mock`(기본, D1) | `http`. `http` 면 `VITE_API_BASE_URL` 이 필수다.
- `VITE_MOCK_FAIL=session` → mock 의 **신청/취소만** `SESSION_EXPIRED` 를 던진다(D44, 수동 검증용).
- `VITE_CAPTCHA` = `on` | `off`(기본). 사용자 대면 토글 UI 는 없다(D34).
- 과목명 조회 최소 2자(원§8.6) · 최대 70자(D55 서버 상한). 벗어나면 요청을 보내지 않고 메시지도 없다(D19).
