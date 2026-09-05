# 규칙 — 아키텍처·폴더·의존 방향

> 근거: `03_frontend_spec.md §4`(디렉토리/컨벤션). 상세 레이아웃은 거기서 Read. 여기는 **불변 경계**만.
> 기본 스택(React 웹): Vite + React + TypeScript · Tailwind + shadcn/ui · TanStack Query · Zustand · React Hook Form + Zod · axios · date-fns. (03 이 명시적으로 달리 정하면 03 우선.)

## 폴더 책임 & 의존 방향 (단방향)
```
app/      앱 부트스트랩·라우터·프로바이더   → pages, shared 참조
pages/    라우트별 얇은 페이지            → features, shared 참조
features/{domain}/  도메인 로직(api·hooks·schemas·components)  → shared 만 참조
shared/   도메인 무관 공용              → 외부 라이브러리만 참조
```

## 불변 경계 (위반 = 빌드 거부 대상)
- `features/{a}` 는 `features/{b}` 를 **직접 import 금지**. 공유가 필요하면 `shared/` 로 올린다.
- 하위 레이어가 상위 레이어를 import 하지 않는다(예: `shared` → `features` 금지).
- import 는 **절대경로 alias `@/` 만**. 상대경로(`../../`) 금지.

## 파일 네이밍
- 컴포넌트 `PascalCase.tsx` · 훅 `useXxx.ts` · 유틸 `camelCase.ts`
- 타입 `types.ts`/`*.types.ts` · Zod 스키마 `schemas.ts`/`*.schemas.ts` · API 호출 `api.ts`

## 횡단 인프라 위치 (기본 배치 — 03 이 확정)
- `shared/api/`: `client.ts`(axios 인스턴스), `errorHandler.ts`, `types.ts`(공통 응답 형태). 인증이 있으면 `tokenManager.ts`·재발급 큐 등도 여기.
- `features/auth/`(인증이 있는 프로젝트): `store.ts`, `api.ts`, `hooks.ts`, `types.ts`.
- `shared/constants/`: `routes.ts`, `labels.ts`(enum 표시명), `fieldLimits.ts` 등.

관련: [[good-patterns]] · [[antipatterns]] · [[api-contract]]
