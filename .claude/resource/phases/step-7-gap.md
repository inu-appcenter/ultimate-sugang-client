# Step 7 — 명세 gap 화면 (`step-7:PRINT_CHECK` · `step-7:PRINT_APPLY` · `step-7:WAITING_ROOM`) — ⛔ 답변 전 진행 금지

## 목적
확인서출력·시간표출력·대기열 화면. **명세에 내용이 없다**(Q-5·Q-6). 사용자 답변이 있을 때만 구현한다.

## 선행조건
- `step-6:*` 전부 COMPLETED **그리고** Q-5(출력 2화면) / Q-6(대기열) 답변이 `rules/decisions.md` 에 D 로 기록됨.
- 답변이 없으면: 각 항목을 `SKIPPED`(사유 `Q-5 미답`/`Q-6 미답`)로 표시하고 `log` 에 기록한 뒤 다음 Step 으로. **추측 구현 금지.**

## 참조파일
- `01` §8(대기열)·§9(출력) · `05` §8(gap 화면 — 확보된 CSS `.timeT`/`.leftT`) · `02` §3 O-12~14(인터페이스 미정의) · `04` §1-2(time-* 토큰)
- 답변 반영 후: 해당 D 항목 + (spec 개정이 필요하면 사용자 승인 하에 phase 역전환 없이 `decisions.md` 로만 보강 — spec/ 은 읽기전용)

## 절차 (답변 있을 때)
1. 답변 내용을 D-n 으로 기록(오케스트레이터). 어댑터 인터페이스에 O-12~14 추가(mock 구현 포함).
2. `step-7:PRINT_CHECK` → `step-7:PRINT_APPLY`(`.leftT`/`.timeT` 이식 CSS 사용) → `step-7:WAITING_ROOM` 순, 각각 게이트 → 커밋 → 리뷰어 2종 → JSON.

## 출력
- 구현 또는 SKIPPED 사유. 리뷰 패킷(§F 에 미답 질문 재게시) → 정지.

## 실패처리 / 다음 phase
- 자가수정 3회 → manual_review. → `step-8-qa.md`.
