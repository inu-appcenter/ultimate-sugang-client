# Step 4 — 조건 없음 3화면 + 신청 플로우 (`step-4:JUNGONG` · `step-4:HUSS` · `step-4:BASKET`)

## 목적
즉시 로드 화면 3종. **신청 플로우(alert·검증 메시지·신청내역 추가·조회목록 미갱신)는 `JUNGONG` 에서 구현**하고 HUSS·BASKET 이 재사용한다.

## 선행조건
- `step-3:*` 전부 COMPLETED.

## 참조파일
- `01` §4-1(공통)·§4-3(JUNGONG 안내 3줄)·§4-7(HUSS)·§4-2(BASKET)·§5(컬럼)·§6-1·§6-3·§6-4·§6-5(메시지)
- `05` §4(테이블·액션 셀·4상태)·§5(컬럼 순서 10/9/10)·§5-4
- `02` §4-1(검증 순서)·§4-3(에러 코드) · `03` §5-2~5-5 · D3·D4·D5·D6·D9·D21

## 절차 (한 번에 하나)
1. **`step-4:JUNGONG`** — `JungongScreen`: 제목 `>> 전공과목`, 안내 3줄(2행 `em`), `CourseTable(SCREEN_COLUMNS.Jungong)`, 즉시 로드. `ActionButton` 신청 → `useEnroll` → 성공 `ENROLL_OK`(교과목명 치환) alert + `enrollments` invalidate **만** / 실패 코드별 alert. `마감` 행 클릭 불가. mock 픽스처로 `DUP_SUBJECT`(게임프로그래밍 2분반)·`DUP_TIME`·`CLASS_FULL` 재현 확인.
2. **`step-4:HUSS`** — 제목 `>> HUSS과목`, 안내 없음, 컬럼 9(이수구분 제거).
3. **`step-4:BASKET`** — 제목 `>> 장바구니`, 안내 없음, 컬럼 10, 담기 UI 없음.
4. 항목마다 게이트 → 커밋 → 리뷰어 2종 → JSON → COMPLETED.

## 출력
- 신청 성공/실패 메시지 원문 일치, 신청내역 즉시 반영, 조회목록 버튼 유지(D4). 리뷰 패킷 → 정지.

## 실패처리 / 다음 phase
- 자가수정 3회 → manual_review. → `step-5-select.md`.
