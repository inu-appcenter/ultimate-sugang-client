# Step {N} — {그룹 이름: 예) 단순 목록 화면 4개} (템플릿 — init 이 화면 그룹별로 인스턴스화)

## 목적
{화면 ID 목록} 을 구현. 각 화면은 `implement-one-screen` 절차를 따른다.

## 선행조건
- 직전 Step COMPLETED.

## 참조파일
- `.claude/spec/01_behavior_spec.md` §{해당 화면들}
- `.claude/spec/02_api_spec.md` §{해당 리소스}
- `.claude/spec/05_screens_spec.md` §{해당 화면들}, `.claude/spec/04_design_system.md`
- `.claude/skills/implement-one-screen/SKILL.md`, `.claude/rules/decisions.md`

## 절차
- 체크리스트의 화면 항목(`step-{N}:SCREEN_ID`)을 **하나씩** 구현(다중 화면 동시 금지). 화면마다 게이트→커밋→리뷰어 2종→리뷰 JSON→(Step 종료 시)패킷.
- 확정 결정 D1~ 해당 화면에 반영.

## 출력
- 각 화면 4상태 + 상호작용 동작. 완료기준은 01/05 의 해당 § 충족.

## 실패처리 / 다음 phase
- 자가수정 3회. → 다음 Step.
