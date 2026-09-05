# Step 2 — 횡단 인프라 (`step-2-infra`)

## 목적
데이터 계층(스키마·어댑터 인터페이스·mock 어댑터·api 래퍼·queryKeys·훅), 세션 스토어, 상수(codes·notices·messages·screens·columns·appText·fieldLimits), 공용 컴포넌트(ThEn·ActionButton·CourseTable 골격·ResultArea·PracticeBanner·RequireSession·dialog).

## 선행조건
- `step-1-setup` COMPLETED.

## 참조파일
- `.claude/spec/02_api_spec.md` §2(모델) · §3(오퍼레이션 O-1~11) · §4(검증·에러·메시지) · §5(enum 전문 — 76·32 목록 그대로 복사)
- `.claude/spec/03_frontend_spec.md` §3(어댑터·mock·검증 시뮬레이션) · §4(파일 위치) · §5(횡단정책 전체)
- `.claude/spec/01_behavior_spec.md` §3(데이터 사전) · §4(안내 문구 전문) · §5(컬럼 매트릭스) · §6-5(메시지)
- `.claude/spec/05_screens_spec.md` §4(테이블 공통·컬럼 폭)
- `.claude/rules/api-contract.md` PROJECT 블록 · `.claude/rules/decisions.md` D1·D4·D6·D9·D10·D14·D19·D22

## 절차
1. `features/sukang/schemas.ts`(Zod, `z.infer`) → `api/types.ts`(`SukangApi`·`SukangError`·코드 enum) → `api/mock/{fixtures,validate,mockApi}.ts`(D22 시드, `02 §4-1` 순서 검증, `resolvedType` 근사) → `api/httpApi.ts`(스텁: `NOT_CONFIGURED`) → `api/index.ts`(env 스위치) → `api.ts`(parse 래퍼).
2. `queryKeys.ts` → `hooks.ts`(`useStudent`·`useCourseList(screen,params,enabled)`·`useEnrollments`·`useEnroll`·`useCancel`; 성공 시 invalidate 규칙 `03 §5-4`).
3. `shared/session/store.ts`(D14) · `shared/config/env.ts` · `shared/api/{client,delay,serverTime}.ts` · `shared/lib/{cn,dialog}.ts` · `shared/constants/{routes,appText,fieldLimits}.ts`.
4. `features/sukang/constants/{screens,notices,messages,codes}.ts` — **문구·목록은 spec 원문 복사**(오탈자 포함 D5, `ㆍ` U+318D, 쉼표 포함 이름 2건).
5. `columns.ts`: `SCREEN_COLUMNS`(7) + `ENROLLMENT_COLUMNS`(11) — key·ko·en(D21)·width(D10)·cell 렌더 종류.
6. 공용 컴포넌트: `ThEn`·`PracticeBanner`·`RequireSession`·`ActionButton`·`ResultArea`·`CourseTable`(colgroup·thead·4상태 D9·행 색)·`CourseTitleCell`. 라우터에 `RequireSession` 적용.
7. mock 로 `useCourseList('Jungong')` 가 픽스처를 parse 해 반환하는지 최소 확인(콘솔/임시 페이지 — 커밋 전 제거).

## 출력
- 이후 화면 Step 이 `features/sukang` + `shared` 만으로 조립 가능. 게이트 `--full` OK. 커밋 `feat: step-2-infra 데이터 계층·세션·상수·공용 컴포넌트`.
- `http` 어댑터 실구현은 **하지 않음**(Q-1) → 리뷰 패킷 §F 에 위임 항목으로.

## 실패처리 / 다음 phase
- 자가수정 3회 → manual_review. → `step-3-shell.md`.
