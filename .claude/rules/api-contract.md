# 규칙 — API 계약 준수

> 근거: `02_api_spec.md`(spec/). 엔드포인트/필드/응답은 **반드시 거기서 확인**. 여기는 불변 규칙 + init 이 추출한 공통 형태만.

## 절대 규칙
- 명세에 **없는 엔드포인트/필드/쿼리 만들지 않는다.** 필요해 보이면 멈춰 질문(🙋🏻). → [[source-of-truth]]
- 모든 응답은 **Zod 스키마로 파싱 후** 사용. `any`/캐스팅 우회 금지. 스키마는 `features/{domain}/schemas.ts`.
- enum 값 임의 추가/변경 금지. 상태전이 제약은 백엔드 검증 + 프론트 UI 차단 이중으로.
- datetime 전송은 명세의 형식을 따른다(불명시 시 ISO 8601 UTC 를 제안하고 🙋🏻 확인).

<!-- PROJECT:BEGIN — harness-init 이 02_api_spec 에서 추출해 채운다. 값 창작 금지, 02 에 있는 사실만. -->
## 공통 응답 형태 (`02 §1`)
- **⚠️ HTTP 계약 미제공(Q-1).** 명세는 "서버·API 별도 존재"(원§0)라고만 하고 엔드포인트·메서드·URL·envelope·상태코드를 정의하지 않는다. → **엔드포인트를 창작하지 않는다.** 데이터 접근은 `features/sukang/api.ts` → 어댑터(`mock` 기본, D1) 뒤로 격리. `http` 어댑터는 계약 도착 전 구현 금지(스텁만).
- Base URL: 미제공 → env `VITE_API_BASE_URL`(`03 §8`, http 어댑터 선택 시에만 필수).
- 페이지네이션: **없음** — 전건 반환·전건 렌더링(원§1).
- 에러 표현: HTTP 표현 미제공. 프론트 내부 에러 종별 `SukangErrorCode` = `02 §4-3`(DUP_TIME·DUP_SUBJECT·CREDIT_EXCEEDED·CLASS_FULL·SESSION_EXPIRED·NOT_IN_PERIOD·TIMEOUT). 메시지는 카탈로그 원문 그대로(`한글\n 영문`, 오탈자 유지 D5), 채널은 `window.alert`/`confirm` 만.
- 상태코드 관례: 미제공(Q-1).
- 응답 지연: 서버 200~800ms 랜덤(원§12) — mock 도 동일 시뮬레이션.

## Enum (`02 §5`) — 값 추가/변경 금지
- 교양 이수구분 `cmbCptnGbn`: `11 기초교양`·`21 핵심교양`·`23 심화교양`·`50 교직`·`70 군사학`·`80 일반선택`. 하위 이수영역은 11/21/23 만: `cmbFldGnb11`(161·162) · `cmbFldGnb21`(171~176) · `cmbFldGnb23`(182~186). **3단계 없음.** `162 기초과학ㆍ공학` 의 `ㆍ` 는 U+318D.
- 타학과 학과(부) `cmbTagwaCd`: **76개**(`02 §5-2` 원문 순서, 영문→가나다). 연계전공 `cmbYungaeCd`: **32개**(`02 §5-3`; 이름에 쉼표 포함 2건 — 쉼표 분리 금지). **코드값 미제공(Q-14)** → mock 은 이름을 값으로.
- select placeholder 원문(`02 §5-4`): `===== 이수구분 =====` · `===== 이수영역 =====` · `========== 학과(부) ==========` · `========== 연계전공 ==========` (`=` 개수 그대로).
- 교과목명 태그: `[75분수업]` · `[온라인혼합형강좌]` · `[e-Learning]`.
- 메뉴 키: `Basket`·`Jungong`·`Gyoyang`·`Tagwa`·`Yungae`·`Huss`·`Custom`. 출력 타입 `check`·`apply`.
- 이수구분 표시값(`courseType`/`resolvedType`)·`Student.status`·학년은 **enum 으로 제약하지 않고 문자열 표시**(전체 목록 미제공 Q-14).

## 상태전이 (백엔드 검증, 프론트도 UI 차단) — `02 §4`
- 신청 검증 순서: (CAPTCHA 미구현 D3) → 시간표 중복 `DUP_TIME` → 동일 과목명 `DUP_SUBJECT`(시간 미겹침에도 차단, 독립) → 학점 상한 `CREDIT_EXCEEDED` → 정원 `CLASS_FULL`(프론트는 `isClosed` 행에 `마감` 버튼으로 **사전 차단 — 핸들러 없음**).
- 이수구분은 **파생값**: 조회 = `Course.courseType`(개설학과 기준), 신청내역 = `Enrollment.resolvedType`(학생 기준, 서버 산출). 프론트 재계산 금지 — 두 값을 각각 표시.
- 신청 성공 → 신청내역만 재조회. **조회 목록은 갱신하지 않는다**(D4). 취소 → confirm 후 신청내역 재조회.
- 재수강 구분 신규 = 빈 값. 순번 1부터.

## 인증·토큰 (`02 §1`)
- **없음.** 인증/세션 로직 재현 안 함(원§0). 학번은 표시용 식별자(Zustand + sessionStorage, D14). 토큰·쿠키·재발급 큐·인증 헤더 없음. `SESSION_EXPIRED`(서버 시뮬레이션) → alert 후 `/` 복귀.
- **비밀번호 필드 금지**(`input[type=password]` 생성 시 빌드 거부 대상).
<!-- PROJECT:END -->
관련: [[decisions]] · [[architecture]] · [[good-patterns]]
