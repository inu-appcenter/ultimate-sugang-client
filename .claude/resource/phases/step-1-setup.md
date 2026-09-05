# Step 1 — 프로젝트 셋업 (`step-1-setup`)

## 목적
Vite+React+TS 스캐폴드, 디자인 토큰(`04 §1`) + 원본 CSS 이식(`04 §4`) → `globals.css`, Tailwind 설정(radius 0·토큰 매핑·반응형/다크 금지), `@/` alias, env 구조, 폴더(`03 §4`), 빈 라우트 2개.

## 선행조건
- phase=BUILD, `spec/` 6문서 존재(spec-presence OK). Node 18+.

## 참조파일
- `.claude/spec/03_frontend_spec.md` §1(스택·편차) · §4(디렉토리) · **§7(셋업 체크리스트 1~10)** · §8(env)
- `.claude/spec/04_design_system.md` §1(토큰 전체) · §4(CSS 이식 원칙)
- `.claude/rules/ui-conventions.md` PROJECT 블록(토큰↔Tailwind 매핑 표) · `.claude/rules/architecture.md` · `.claude/rules/decisions.md` D2·D8·D13·D18

## 절차
1. `03 §7` 1~9 를 순서대로. 현 디렉토리에 스캐폴드(`.claude/`·`intake/`·`README.md`·`.gitignore` 보존 — 덮어쓰기 금지).
2. `src/shared/styles/globals.css`: `@tailwind` 3줄 → `:root` 토큰(`04 §1-1~1-4` 전체, hex 는 여기서만) → 원§6 CSS 규칙 단위 이식(hex/명명색 → `var()`, 이미지 url 제거) → 하네스 추가 규칙(`.th-en`·`.tag`·`.scr-noti`·`.practice-banner`·`.dataT .grey .tag{color:inherit}`).
3. `tailwind.config.ts`: `theme.extend.colors/fontSize/fontFamily/spacing/height/width/minWidth` = 매핑 표 명명(값은 `var(--…)` 참조). `borderRadius` 전부 `'0'`. `screens: {}`(breakpoint 제거).
4. 라우트 `/`·`/sukang` placeholder. shadcn·sonner·lucide **설치 금지**(D2).
5. `.env.example` 3변수(`03 §8`). `.env` 생성 금지.
6. token-lint allow(`.claude/hooks/checks/token-lint.allow.txt`)는 이미 `src/shared/styles/globals.css`·`tailwind.config.ts` 포함 — 추가 편집 불필요.

## 출력
- `npm run dev` 동작, `/`·`/sukang` 404 없음. `bash .claude/hooks/checks/gate-runner.sh --full` = `OK`.
- 커밋 `chore: step-1-setup 스캐폴드·토큰·CSS 이식`.

## 실패처리
- 게이트 red → 자가수정(한도 3, `retry["step-1-setup"]`) → 초과 시 `manual_review` + 정지.

## 다음 phase
- `step-2-infra.md`. (Step 종료 → 리뷰 패킷 제출 후 정지)
