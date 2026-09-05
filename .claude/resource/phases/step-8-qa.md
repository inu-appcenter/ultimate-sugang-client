# Step 8 — QA (`step-8-qa`)

## 목적
최고위험 흐름 Playwright 스모크 + 전 화면 4상태/상호작용/문구 최종 점검.

## 선행조건
- 화면 Step 전부 COMPLETED 또는 SKIPPED(사유 기록).

## 참조파일
- `.claude/spec/03_frontend_spec.md` **§9(스모크 후보 1~7 + 수동 점검)** · `01` §6(플로우·메시지)·§11(Q 목록) · `.claude/rules/hooks.md`(게이트 모드)

## 절차
1. `npm i -D @playwright/test` + `npx playwright install chromium`. `playwright.config.ts`: `testDir: .claude/resource/smoke`, baseURL dev 서버(mock 어댑터), `page.on('dialog')` 로 alert/confirm 메시지 캡처.
2. `.claude/resource/smoke/*.spec.ts`: `03 §9` 1~7 중 최소 4개(로그인 왕복 · 신청 성공+미갱신 · DUP_SUBJECT · 취소 confirm) — 메시지 **원문 정확 일치** 단언(`\n` + 공백 포함).
3. `bash .claude/hooks/checks/gate-runner.sh --with-smoke` = OK.
4. 수동 점검 체크리스트(`03 §9`): 4상태(D9) 화면별 · 컬럼 세트 7종+11 · 안내 문구 전문 · 배너 상시 · 비밀번호 필드 부재 · 76/32 option 수 · placeholder 원문 · 폰트/12px/radius 0 육안.

## 출력
- `--with-smoke` green + 최종 리뷰 패킷(§F: `http` 어댑터 위임, 미답 Q, 배포 URL `mock`/`practice` 명시는 사람 몫).

## 실패처리
- 자가수정 3회 → manual_review.

## 다음 phase
- 없음(빌드 종료). 배포·실 백엔드 연결은 사람 몫.
