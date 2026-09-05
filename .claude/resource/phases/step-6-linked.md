# Step 6 — 연동 select · 텍스트 2화면 (`step-6:GYOYANG` · `step-6:CUSTOM`)

## 목적
2단 연동 select(하위 3개 전부 렌더 + 표시 토글)와 텍스트 2자 이상 검색.

## 선행조건
- `step-5:*` 전부 COMPLETED.

## 참조파일
- `01` §4-4(GYOYANG 트리·안내 5줄)·§4-8(CUSTOM 안내 2줄) · `02` §5-1(코드 전문, `ㆍ` U+318D)·§5-4 · `05` §5-1·§5-3·§3-3 · `03` §5-5·§5-6(RHF `min(2)`) · `shared/constants/fieldLimits.ts` · D19·D21

## 절차
1. **`step-6:GYOYANG`** — `SearchLinkedSelect`: `#cmbCptnGbn`(6) + `#cmbFldGnb11/21/23` **3개 모두 DOM 렌더**, 1단 값 11/21/23 이면 대응 1개만 표시, 50/70/80/미선택은 전부 숨김, 1단 변경 시 하위 초기화. 조회 `{cptnGbn, fldGnb?}`. 컬럼 9(개설학과 제거·이수영역 추가). 안내 5줄(`가능 합니다` 원문).
2. **`step-6:CUSTOM`** — `SearchText`(200×32, RHF+Zod `min(2)`, Enter/버튼), 2자 미만 no-op(D19). 컬럼 10(최대 집합). 제목 `>> 과목명(코드)조회`.
3. 게이트 → 커밋 → 리뷰어 2종 → JSON → COMPLETED.

## 출력
- 토글·검증 동작. 7개 탭 화면 전부 완료. 리뷰 패킷 → 정지.

## 실패처리 / 다음 phase
- 자가수정 3회 → manual_review. → `step-7-gap.md`.
