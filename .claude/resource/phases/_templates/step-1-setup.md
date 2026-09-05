# Step 1 — 프로젝트 셋업 (템플릿 — init 이 프로젝트에 맞게 인스턴스화)

## 목적
Vite+React+TS 스캐폴드, 디자인 토큰 매핑, shadcn/ui, 라이브러리, alias, env 구조, 폴더, 빈 라우터.

## 선행조건
- phase-0 통과. `spec/` 6문서 존재(phase=BUILD).

## 참조파일
- `.claude/spec/03_frontend_spec.md` §스택·§구조·§env
- `.claude/spec/04_design_system.md` §토큰
- `.claude/rules/architecture.md`, `.claude/rules/ui-conventions.md`

## 절차
- 03 의 셋업 체크리스트를 그대로 수행. 빈 페이지는 `<div>{화면ID}</div>` placeholder.
- 토큰은 `globals.css`(CSS 변수)+`tailwind.config.ts` 에만 정의(token-lint allow 대상).
- `.env` 는 구조(env.ts·.env.example)만 — 비밀값은 사람 입력(PreToolUse 차단).

## 출력
- 전 라우트가 404 없이 매칭. `npm run dev` 동작. `npm run build` 성공.

## 실패처리
- 게이트 red → 자가수정(한도 3) → 초과 시 manual-review + 보고.

## 다음 phase
- `step-2-infra.md`.
