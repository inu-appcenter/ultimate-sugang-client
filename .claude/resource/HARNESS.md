# 스펙 주도 빌드 하네스 템플릿 — 설치/사용

> 이 하네스를 새 프로젝트에서 돌릴 때의 안내. **훅·게이트의 사실 권위는 `.claude/rules/hooks.md`** (여기서 재서술하지 않는다).

## 이 템플릿이 하는 것
명세 1개(또는 여러 개)를 받아 → `harness-init` 이 SoT 6문서·규칙·체크리스트를 생성 → `build-orchestrator` 가 체크리스트를 한 항목씩 (구현 → 자동 게이트 → 리뷰어 2종 → 커밋 → 사람 승인) 루프로 진행한다. 대상: **React 웹 프로젝트**(기본 스택 Vite+React+TS·Tailwind+shadcn·TanStack Query·Zustand·RHF+Zod).

## 설치 (새 프로젝트)
1. 이 repo 루트 전체(또는 최소 `.claude/` + `intake/`)를 새 빈 repo 에 복사. `git init` 되어 있어야 한다(오케스트레이터가 항목별 커밋).
2. Node 18+ 확인(게이트/훅이 node 사용).
3. Claude Code 로 repo 를 연다 → `.claude/CLAUDE.md`·`rules/` 자동 로드, `settings.json` 훅 활성. SessionStart 훅이 `phase=INIT — harness-init 대기` 를 띄우면 정상.
4. (선택) Figma Dev Mode MCP 연결 — 화면별 Figma URL 을 쓸 계획이면.

## 사용
1. **초기화**: 원본 명세를 `intake/` 에 넣거나 대화에 붙여넣고 "이 명세로 초기화해줘" → `harness-init` 이 spec 6문서·체크리스트 생성 후 **init 리포트 제출·정지**. 🙋🏻 질문에 답하고 승인.
2. **빌드**: "빌드 시작" / "이어서" → `build-orchestrator` 가 Phase 0 복구로 재개 지점 판단 후 진행. 세션이 끊겨도 `build-state.json` 이 척추라 이어서가 된다.
3. **승인 루프**: 매 Step 종료 시 리뷰 패킷 제출 후 정지 → 승인하면 다음 Step.

## 게이트 강도 (상세는 rules/hooks.md)
- **fast**(Stop 훅·매 턴): validate-state · typecheck · token-lint.
- **`--full`**(커밋/리뷰패킷 전): + 프로덕션 빌드. **`--with-smoke`**(QA): + Playwright.
- lint 는 PostToolUse 에서 자동수정(소프트, 비차단).
- 자가수정 3회 초과 → `manual-review` + 정지(사람 검수). 데드락 없음.
- 안전 차단(PreToolUse): rm -rf · 원격푸시 · 배포/publish · (BUILD)spec/ 쓰기 · `.env` 비밀값. 비가역은 코드 구조만, 실행은 사람.

## 구조 한눈에
| 버킷 | 경로 | 내용 |
|---|---|---|
| **skill** | `.claude/skills/` | harness-init(초기화) · build-orchestrator · implement-one-screen · build-review-packet · git-commit-push |
| **agent** | `.claude/agents/` | 무상태 리뷰어(spec-conformance·architecture·ds-conformance) |
| **hook** | `.claude/hooks/` | 진입점(session-start·pretool-guard·posttool-lint·stop-gate) + `checks/`(gate-runner·validate-state·spec-presence·typecheck·token-lint·build·smoke·lint) |
| **spec** | `.claude/spec/` | SoT 6문서 — init 생성, BUILD 부터 읽기전용. 인덱스 = `00_INDEX.md` |
| **입력** | `intake/` | 원본 명세 투입함(형식 자유) |
| **기타** | `.claude/resource/` | `phases/`(phase-0 + `_templates/` — init 이 step 파일 인스턴스화) · `smoke/` · `HARNESS.md`(이 파일) |
| (예약·고정) | `CLAUDE.md`·`settings.json`·`build-state.json`·`rules/` | 상시 인덱스 · 훅 배선 · 척추(phase+checklist) · 자동로드 규칙 |

> `skills/`·`agents/`·`rules/`·`settings.json`·`CLAUDE.md` 는 Claude Code 예약 이름이라 이름 변경/이동 불가 — top-level 고정.
> 리뷰 산출물은 `<repo>/harness/review/<항목ID>.json` (validate-state 가 COMPLETED 화면 항목에 요구).
