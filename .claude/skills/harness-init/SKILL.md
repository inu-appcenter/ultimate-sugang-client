---
name: harness-init
description: 원본 명세(제품 명세·API 문서·디자인 문서 등)를 받아 하네스를 초기화한다. SoT 6문서 생성 → rules PROJECT 블록 채움 → 체크리스트·phase 파일 생성 → phase=BUILD 전환 → init 리포트 제출 후 정지. phase=INIT 에서 "초기화", "명세 줄게", "이 명세로 시작" 등의 요청에 사용.
---

# 하네스 초기화 (명세 → 자동 빌드 루프)

**목표**: 사용자 원본 명세 1개(또는 여러 개)를 하네스가 소비 가능한 SoT 구조로 변환하고, build-orchestrator 가 무인 루프를 돌 수 있는 체크리스트를 세운다.

**대원칙 — fill, not invent**: `01`(동작)·`02`(API) 는 사용자 명세의 **사실 재구성만** 한다. 명세에 없는 엔드포인트/필드/화면/검증 규칙을 창작하면 그 오염이 전체 빌드에 전파된다. gap 은 창작 대신 **🙋🏻 질문으로 기록**한다. 창작이 허용되는 곳은 `03`(프론트 계획 — 하네스 소유)과, 명세 부재 시의 `04`/`05` 기본값(채택 내역을 decisions 에 기록)뿐이다.

## 0. 전제 확인
- `.claude/build-state.json` 의 `meta.phase` 가 `INIT` 인지 확인. `BUILD` 면 이미 초기화됨 — 재초기화는 파괴적이므로 사용자 명시 승인 없이 진행 금지(🙋🏻).
- Node 18+ 존재 확인(`node --version`) — 훅/게이트가 사용.

## 1. 인테이크
- 원본 명세 수집(아무 형식이나): 스킬 인자로 받은 경로 / `intake/` 폴더의 파일들 / 대화에 붙여넣은 텍스트 / URL(Read 또는 fetch).
- 전부 Read 한 뒤 **인테이크 목록**(파일명·버전·성격)을 기록해 둔다(리포트 §A 용).
- 프로젝트 이름을 명세에서 추출(불명확하면 사용자에게 1회 질문).

## 2. 분석 — 커버리지 매트릭스
원본 명세를 다음 축으로 분해하고, 각 축의 **출처(원본 문서·섹션)** 와 **gap** 을 표로 만든다:
| 축 | 추출 대상 |
|---|---|
| 화면 목록 | 화면 ID·이름·역할·진입 경로(IA) |
| 도메인 | 엔티티·필드·데이터 사전 |
| API | 엔드포인트·메서드·요청/응답 필드·상태코드·에러 envelope·페이지네이션 |
| enum·상태전이 | 값 목록, 허용 전이, 위반 시 동작 |
| 검증 규칙 | 필드 필수/길이/형식, 화면별 규칙 |
| 인증 | 방식·토큰 정책(없으면 "없음") |
| 디자인 | 토큰(색/타이포/간격)·컴포넌트·레이아웃·상호작용(없으면 "부재 → 기본 DS") |
| 비가역 작업 | 배포·상태 promote 류 — 사람 위임 대상 표시 |
- **모순 발견 시**: 임의 해소 금지. 해소 가능한 근거(더 구체적인 문서, 사용자 발언)가 있으면 decisions 후보로, 없으면 🙋🏻 질문으로.

## 3. SoT 6문서 생성 (`.claude/spec/` — 정확히 이 파일명)
phase=INIT 이므로 쓰기 가능. 각 문서 머리에 출처(원본 문서명)와 성격(사실 재구성/하네스 계획/기본값)을 명시한다. §번호 체계를 부여해 이후 인용(`01 §6-2` 식)이 가능하게 한다.
1. `01_behavior_spec.md` — 화면 동작·IA·상태전이·검증·도메인 사전. **사실 재구성만**, gap 은 `> 🙋🏻` 블록.
2. `02_api_spec.md` — API 계약 전체. **사실 재구성만**. 원본이 이미 API 문서면 구조만 정리해 수록.
3. `03_frontend_spec.md` — **하네스가 작성하는 계획 문서**: 스택(기본: Vite+React+TS·Tailwind+shadcn·TanStack Query·Zustand·RHF+Zod·axios·date-fns), 폴더 구조([[architecture]] 준수), 횡단정책(인증/에러/폼/이탈보호 — 02 사실에 기반), **Step 계획**(§5 참조), §2 문서 정합성 노트(분석 중 발견한 모순과 해소).
4. `04_design_system.md` — 토큰·컴포넌트. 원본 디자인 명세 있으면 재구성, 없으면 **하네스 기본 DS**(shadcn 기본 + 중립 팔레트 + 시맨틱 토큰) 생성 후 "하네스 기본값" 표기.
5. `05_screens_spec.md` — 화면별 시각 명세 + 상호작용 패턴. 없으면 01 의 동작 명세에서 시각 골격만 도출(창작 최소화, "init 도출" 표기).
6. `00_INDEX.md` — 문서 목록·관할 표·충돌 우선순위·멈춤 규칙(이 하네스의 [[source-of-truth]] §1~3 구조를 따름).

## 4. rules PROJECT 블록 채움
`<!-- PROJECT:BEGIN -->` ~ `<!-- PROJECT:END -->` 블록만 수정(범용 불변식 본문은 건드리지 않는다):
- `rules/api-contract.md` — Base URL·envelope·페이지네이션·enum·상태전이·인증(전부 02 에서 추출한 사실만).
- `rules/ui-conventions.md` — 뷰포트/테마 정책(명세 부재 시 기본값: 데스크탑 1280px+ 단일 폭·라이트 전용), 토큰↔Tailwind 매핑 표(04 에서 생성 — shadcn 변수명과 충돌하는 토큰은 별도 네임스페이스로 매핑하고 ⚠️ 표기), 글로벌 레이아웃.
- `rules/decisions.md` — 채택한 기본값·해소한 모순을 D1~ 로 기록(형식은 파일 상단 참조).

## 5. 체크리스트·phase 파일 생성
- **Step 계획 원칙**: step-1 셋업 → step-2 횡단 인프라 → step-3~ 화면(단순→복잡 순으로 그룹핑, 한 화면 = 한 항목) → 마지막 step QA. 복잡한 단일 화면(다중 폼·부분 저장 등)은 하위단계로 쪼갠다.
- **id 컨벤션(리뷰 강제와 연동 — [[hooks]])**: 비리뷰 항목 `step-N-이름`(예: `step-1-setup`), 화면/하위단계 `step-N:SCREEN_ID`(예: `step-3:LOGIN`) — 콜론 항목은 COMPLETED 전환에 리뷰어 2종 PASS JSON 이 강제된다.
- `build-state.json.checklist` 에 전 항목을 `TODO` 로 기입. `meta.project` 기입.
- `resource/phases/` 에 `_templates/` 를 바탕으로 step 파일 생성(목적/선행조건/참조파일(spec §)/절차/출력/실패처리/다음 phase). 화면 Step 은 `implement-one-screen` 을 참조하게 한다.
- 화면별 Figma URL 을 이 시점에 받았으면 `build-state.json.figma` 에 기록(선택 — 없어도 진행).

## 6. 검증 (green 확인 후에만 다음)
```bash
node .claude/hooks/checks/spec-presence.mjs   # 6문서 파일명 정합
node .claude/hooks/checks/validate-state.mjs  # 상태 무결성
```
- 경고/FAIL 이 있으면 여기서 수정. (창작으로 메우지 말 것.)

## 7. phase 전환 + 리포트 제출 후 정지 (사람 게이트)
- `build-state.json`: `meta.phase = "BUILD"`, `log` 에 init 기록 추가.
- **init 리포트** 제출:
  - §A 인테이크: 받은 원본 목록.
  - §B 생성물: spec 6문서 + rules 채움 + checklist(항목 수·Step 구성).
  - §C 기본값 채택: 명세 부재로 하네스 기본값을 쓴 곳(D 번호로).
  - §D 질문(🙋🏻): 창작 대신 남긴 gap — **사용자 답변 필요 목록**.
  - §E 다음: 승인 시 `build-orchestrator` 가 `step-1-setup` 부터 시작.
- **정지.** 사용자 승인("시작", "진행" 등) 후에만 build-orchestrator 로 넘어간다. §D 에 빌드를 막는 질문(계약 수준 gap)이 있으면 답변 전 해당 화면 항목을 진행하지 않는다.

참조 규칙: [[source-of-truth]] · [[architecture]] · [[api-contract]] · [[ui-conventions]] · [[decisions]] · [[hooks]]
