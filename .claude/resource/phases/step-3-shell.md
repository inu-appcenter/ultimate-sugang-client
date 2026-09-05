# Step 3 — 로그인·메인 골격·신청내역 (`step-3:LOGIN` · `step-3:MAIN_SHELL` · `step-3:ENROLLMENT_LIST`)

## 목적
사용자가 로그인 → 메인 골격을 보고 → 신청내역에서 취소까지 할 수 있는 최소 왕복. 각 항목은 `implement-one-screen` 절차.

## 선행조건
- `step-2-infra` COMPLETED.

## 참조파일
- `LOGIN`: `.claude/spec/01_behavior_spec.md` §7 · `.claude/spec/05_screens_spec.md` §2 · D12·D14·D19
- `MAIN_SHELL`: `01` §2-2·§3-6 · `05` §1·§3(3-1~3-5) · D7·D8·D11·D17·D20
- `ENROLLMENT_LIST`: `01` §6-2·§6-5·§6-6 · `05` §6·§4 · `02` §2-2·§4-3 · D4·D5·D9
- 공통: `.claude/skills/implement-one-screen/SKILL.md` · `.claude/rules/decisions.md`

## 절차 (항목 순서 고정 — 한 번에 하나)
1. **`step-3:LOGIN`** — `features/login`(RHF+Zod `min(1)`), `LoginBox`(05 §2 마크업·클래스 원문), 비밀번호 필드 **없음**, 배너 박스 하단, 성공 → `session.login` → `/sukang`. Figma 없음 → 05 기반.
2. **`step-3:MAIN_SHELL`** — `SukangShell`(05 §1 순서)·`PerTable`(useStudent, 포맷 `{a} / {b}`)·`MenuTabs`(7, `?menu`, 활성 강조 없음)·주의 문구·`ScreenTitle` 슬롯·`ScreenNotice`·결과 영역 슬롯(화면 컴포넌트는 placeholder `<div>{SCREEN_ID}</div>`)·`EnrollmentArea` 자리.
3. **`step-3:ENROLLMENT_LIST`** — `EnrollmentTable`(11컬럼, `resolvedType`, 순번, 빈 재수강) + `PrintButtons`(렌더만, Q-5) + 취소 플로우(confirm → cancel → alert → 재조회). 4상태 D9.
4. 각 항목: 게이트 `--full` → 커밋 → 리뷰어 2종(spec·ds) → `harness/review/<id>.json` → COMPLETED.

## 출력
- 로그인 → 메인 골격 → 신청내역 취소 왕복 동작. Step 종료 시 리뷰 패킷(`build-review-packet`) 제출 후 **정지**.

## 실패처리 / 다음 phase
- 자가수정 3회 → manual_review. → `step-4-nocond.md`.
