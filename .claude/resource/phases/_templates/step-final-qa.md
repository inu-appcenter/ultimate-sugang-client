# Step {N} — QA (템플릿 — init 이 마지막 Step 으로 인스턴스화)

## 목적
최고위험 흐름 스모크 자동화 + 전 화면 4상태/상호작용 최종 점검.

## 선행조건
- 모든 화면 Step COMPLETED.

## 참조파일
- `.claude/spec/01_behavior_spec.md`(위험 흐름·검증), `.claude/rules/hooks.md`(게이트 모드)

## 절차
1. Playwright 설치(`npm i -D @playwright/test` + 브라우저).
2. 최고위험 흐름 2~4개를 골라 `.claude/resource/smoke/*.spec.ts` 작성(예: 인증 리다이렉트, 파괴적 액션 confirm, 핵심 CRUD 왕복).
3. `bash .claude/hooks/checks/gate-runner.sh --with-smoke` green 확인.
4. 전 화면 수동 점검 체크리스트 수행(4상태·모달·토스트·이탈보호).

## 출력
- `--with-smoke` green + 최종 리뷰 패킷.

## 실패처리
- 자가수정 3회 → manual-review.

## 다음 phase
- 없음(빌드 종료). 배포는 사람 몫.
