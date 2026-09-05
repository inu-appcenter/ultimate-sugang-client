# 규칙 — 훅·게이트 동작 (단일 권위)

> 훅·게이트의 **사실은 이 파일이 권위**다. CLAUDE.md·resource/HARNESS.md 는 여기로 가리키기만 한다(재서술 금지).
> 배선: `.claude/settings.json`. 스크립트: `.claude/hooks/`(진입점) + `.claude/hooks/checks/`(검증).

## hooks/ 구조
- `hooks/` — settings.json 이 직접 부르는 **진입점**: `session-start.mjs` · `pretool-guard.mjs` · `posttool-lint.mjs` · `stop-gate.mjs`.
- `hooks/checks/` — 진입점이 호출하는 **결정적 검증**: `gate-runner.sh`(묶음) · `validate-state.mjs` · `spec-presence.mjs` · `typecheck.sh` · `token-lint.mjs`(+`token-lint.allow.txt`) · `build.sh` · `smoke.sh` · `lint.sh`.

## 배선된 훅 (settings.json)
| 이벤트 | 매처 | 스크립트 | 동작 |
|---|---|---|---|
| **SessionStart** | (전체) | `hooks/session-start.mjs` | phase=INIT 이면 harness-init 안내. phase=BUILD 면 build-state 재개 항목·무결성 + **spec/ 파일명 정합(spec-presence)** 경고 주입. **비차단**(exit 0). |
| **PreToolUse** | `Bash`·`Write`·`Edit`·`MultiEdit` | `hooks/pretool-guard.mjs` | 위험/비가역 차단(exit 2). |
| **PostToolUse** | `Write`·`Edit`·`MultiEdit` | `hooks/posttool-lint.mjs` | 수정한 `src/**.{ts,tsx}` 만 `eslint --fix`. **비차단**(exit 0). |
| **Stop** | (전체) | `hooks/stop-gate.mjs` | 완료 선언 전 **fast 게이트** 강제. red 면 정지 차단(exit 2)→자가수정 유도. |

## phase 게이트 (build-state.json `meta.phase`)
- **`INIT`**: harness-init 이 SoT 를 생성하는 창. `.claude/spec/` 쓰기 **허용**. package.json 이 없으므로 Stop 게이트도 자연 통과.
- **`BUILD`**: init 완료 후. `.claude/spec/` 쓰기 **차단**(`00_INDEX.md` 만 예외). checklist 가 진행 권위.
- 전환은 harness-init 마지막 단계에서 단 1회(INIT→BUILD). 역전환은 사용자 명시 승인 시에만.

## 게이트 모드 (`hooks/checks/gate-runner.sh`)
출력 `OK` 또는 `FAIL\n{사유}`. 모드별 검증 묶음:
- **fast**(인자 없음) = `validate-state` + `typecheck` + `token-lint`. **Stop 훅이 매 턴 실행**(가볍게).
- **`--full`** = fast + `build`. **커밋/리뷰패킷 직전** 오케스트레이터가 실행(무거운 풀빌드는 여기서만).
- **`--with-smoke`** = full + Playwright 스모크. **QA(마지막 Step)**.

## PreToolUse 차단 대상 (pretool-guard.mjs)
- Bash: `rm -rf /|~|..`, `git push`(--force 포함), `gh release|pr merge|repo delete`, npm/yarn/pnpm `publish`, vercel/netlify/firebase/gh-pages deploy·`--prod`, `curl | sh`, (BUILD 에서만) `> .claude/spec/` 리다이렉트.
- Write/Edit: (BUILD 에서만) `.claude/spec/`(**`00_INDEX.md` 만 예외**) · `.env*` 파일(항상). → spec 읽기전용·비밀값은 사람 입력. [[antipatterns]]

## Stop 게이트 (stop-gate.mjs → checks/gate-runner.sh fast)
- `package.json` 없으면(=셋업 Step 이전) 게이트 대상 없음 → **통과**. 셋업 이후 자동 활성화.
- red → 정지 차단(자가수정). **자가수정 한도 3회**(`build-state.json.retry`). 초과하거나 `manual_review` 태그 시 → 데드락 방지로 정지 허용 + 사람 검수.
- token-lint(`checks/token-lint.mjs`): `src/` 의 raw hex·arbitrary 값 탐지. 토큰 정의 파일은 `checks/token-lint.allow.txt` 로, shadcn 생성물은 `src/components/ui` 경로로 제외. → [[ui-conventions]]

## 상태·설치 무결성
- **validate-state.mjs**: `meta.phase` ∈ {INIT,BUILD} · `IN_PROGRESS` ≤ 1 · checklist `id` 유일 · `status` ∈ {TODO,IN_PROGRESS,COMPLETED,SKIPPED,manual-review} · **리뷰 강제**: COMPLETED 인 리뷰 대상 항목(`/^step-\d+:/` — 콜론 포함 id)은 `harness/review/<id>.json` 에 spec/ds 모두 PASS 필요. fast 게이트(매 턴) + SessionStart.
- **checklist id 컨벤션**: `step-N-이름` = 비리뷰 항목(셋업·인프라·QA), `step-N:SCREEN_ID` = 화면/하위단계(리뷰 대상). harness-init 이 이 컨벤션으로 생성해야 리뷰 강제가 작동한다.
- **spec-presence.mjs**: `spec/` 의 SoT 문서(00~05)가 **참조와 정확히 같은 파일명**으로 있는지 검사. **SessionStart 비차단 경고**(phase=BUILD 에서만).

## 경로 계약 (변경 시 동기화 필수)
- 권위 상태 파일: **`.claude/build-state.json`**(단일·top-level). 스크립트는 자기 위치 기준 상대경로로 접근(`stop-gate.mjs`·`session-start.mjs`·`pretool-guard.mjs` → `../build-state.json`, `validate-state.mjs` → `../../build-state.json`).
- 리뷰 JSON: `<repo>/harness/review/<항목ID>.json`.
- smoke 테스트: `.claude/resource/smoke/` (`checks/smoke.sh` 가 실행).
