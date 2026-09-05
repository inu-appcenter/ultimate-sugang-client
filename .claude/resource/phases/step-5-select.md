# Step 5 — 단일 select 2화면 (`step-5:TAGWA` · `step-5:YUNGAE`)

## 목적
`SearchSelect` 패턴(placeholder + 조회 버튼) 화면 2종.

## 선행조건
- `step-4:*` 전부 COMPLETED.

## 참조파일
- `01` §4-5(TAGWA)·§4-6(YUNGAE)·§4-1 · `02` §5-2(76)·§5-3(32)·§5-4(placeholder) · `05` §3-3(제목 라인·`.sjt_sch`·`.btn_sch`)·§5-2 · `03` §5-5(조회 트리거) · D19·D21

## 절차
1. **`step-5:TAGWA`** — `SearchSelect`(`cmbTagwaCd`, 76 원문 순서, value=이름[Q-14]) + 안내 2줄 + 컬럼 9(개설학과 제거). placeholder 상태 조회 → no-op(D19). 동일 조건 재조회 → invalidate.
2. **`step-5:YUNGAE`** — `cmbYungaeCd` 32(쉼표 포함 이름 2건 확인) + 안내 2줄 + 컬럼 8(개설학과·이수구분 제거).
3. 게이트 → 커밋 → 리뷰어 2종 → JSON → COMPLETED.

## 출력
- 조회 전 Empty(헤더만), 조회 후 Data. 리뷰 패킷 → 정지.

## 실패처리 / 다음 phase
- 자가수정 3회 → manual_review. → `step-6-linked.md`.
