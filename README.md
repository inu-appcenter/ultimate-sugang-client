# spec-golem — 스펙 주도 빌드 하네스 템플릿

> 골렘은 이마에 진리(emet)를 적은 문서를 붙이면 스스로 일하고, 문서를 떼면 멈춘다. 이 하네스도 같다 — 명세(SoT = 진실의 원천)를 붙이면 알아서 빌드하고, 사람 게이트에서 멈춘다.

명세 하나를 넣으면 React 웹 프로젝트를 **자동 루프로 구현**하는 Claude Code 하네스 템플릿. Gravit 백오피스 빌드 하네스에서 프로젝트 고유 내용을 걷어내고, 명세 인테이크(`harness-init`)를 추가해 범용화한 것이다.

## 동작 원리 (2-phase)

```
[phase=INIT]                          [phase=BUILD]
원본 명세 (intake/ 또는 붙여넣기)         "빌드 시작"
        │                                  │
        ▼                                  ▼
  harness-init 스킬                  build-orchestrator 스킬
   ├ 명세 분석(커버리지 매트릭스)          └ checklist 루프 (한 번에 1항목):
   ├ spec/ SoT 6문서 생성                    구현(implement-one-screen)
   ├ rules PROJECT 블록 채움                  → 자동 게이트(타입·토큰·빌드)
   ├ checklist + phase 파일 생성              → 리뷰어 2종(spec·ds) PASS 강제
   ├ phase=BUILD 전환                        → 커밋
   └ init 리포트 제출 → 정지(사람 승인)        → Step 끝나면 리뷰 패킷 → 정지(사람 승인)
```

- **환각 방지가 1원칙**: 명세에 없는 엔드포인트/필드/화면은 만들지 않고 🙋🏻 질문으로 멈춘다. init 도 같은 원칙(fill, not invent)으로 SoT 를 생성한다.
- **진행 척추**: `.claude/build-state.json` — phase(INIT/BUILD)와 checklist 가 유일한 권위. 세션이 끊겨도 이어서 가능.
- **훅이 강제**: Stop 훅이 매 턴 fast 게이트(상태 무결성·typecheck·token-lint)를 돌려 red 상태의 "완료 선언"을 차단. PreToolUse 가 비가역 작업(push·배포·spec 수정·.env)을 차단. 리뷰어 미실행은 validate-state 가 잡는다.
- **사람 게이트**: init 종료·매 Step 종료마다 리포트/패킷 제출 후 정지. 승인해야 다음으로.

## 빠른 시작
1. 이 폴더를 새 프로젝트 repo 로 복사(또는 이 폴더에서 바로 시작 — git init 됨).
2. Claude Code 로 열기 → SessionStart 훅이 `phase=INIT` 안내를 띄움.
3. 명세를 `intake/` 에 넣고: **"이 명세로 초기화해줘"**
4. init 리포트의 🙋🏻 질문에 답하고 승인 → **"빌드 시작"**

## 무엇이 범용이고 무엇이 생성되는가
| 범용(템플릿 동봉) | init 이 생성/채움 |
|---|---|
| 훅 4종 + 게이트 스크립트 | `spec/` 6문서 (00~05) |
| 스킬 5종(harness-init 포함) | `build-state.json` checklist·project |
| 리뷰어 에이전트 3종 | `rules/` 의 `PROJECT:BEGIN~END` 블록(enum·토큰표·정책) |
| `rules/` 불변식 본문 | `rules/decisions.md` D1~ (기본값 채택·모순 해소) |
| phase-0 + step `_templates/` | `resource/phases/step-*.md` 인스턴스 |

상세 설치/사용: `.claude/resource/HARNESS.md` · 훅/게이트 권위: `.claude/rules/hooks.md`

---

## 이 저장소의 프로젝트: inu-sugang-mock (INU 수강신청 연습용 모의 사이트)

명세 `intake/INU-수강신청-모의사이트-명세.md` + 시드 `intake/INU-시드데이터.md` 로 빌드한 React 앱. SoT 는 `.claude/spec/`, 결정은 `.claude/rules/decisions.md`(D1~D49).

```bash
npm install
npm run dev                 # http://localhost:5173 — 학번 아무 값이나 입력 → 메인
npm run build && npm run preview
npm run typecheck && npm run lint
npx playwright test .claude/resource/smoke    # 스모크 11건(dev 서버 자동 기동, 최초 1회 npx playwright install chromium)
bash .claude/hooks/checks/gate-runner.sh --with-smoke   # 하네스 게이트 전체
```

- 데이터: mock 어댑터(인메모리 시드 72강좌, 200~800ms 지연, 서버 검증 시뮬레이션). `.env.example` 참고 — `VITE_CAPTCHA=on` 이면 신청 시 CAPTCHA 모달, `VITE_MOCK_FAIL=session` 이면 신청/취소 시 세션 만료 흐름.
- 실 백엔드 계약은 프론트의 `src/features/sukang/api/types.ts`(`SukangApi`) + `src/features/sukang/schemas.ts` 를 기준으로 도출한다(D25). `http` 어댑터는 스텁.
