# Step 2 — 횡단 인프라 (템플릿 — init 이 프로젝트에 맞게 인스턴스화)

## 목적
API 클라이언트·에러 핸들링·공통 응답 스키마·(있으면)인증 흐름·공용 레이아웃(사이드바/헤더)·공통 컴포넌트.

## 선행조건
- step-1 COMPLETED.

## 참조파일
- `.claude/spec/02_api_spec.md` §공통(envelope·페이지네이션·인증)
- `.claude/spec/03_frontend_spec.md` §횡단정책(인증/에러/폼/이탈보호)
- `.claude/rules/architecture.md` "횡단 인프라 위치", `.claude/rules/good-patterns.md`

## 절차
- `shared/api/`(client·errorHandler·types) → (있으면) `features/auth/` → `shared/constants/` → 전역 레이아웃 → 공용 컴포넌트(모달·토스트·테이블 골격·4상태 프리미티브) 순.
- 인증이 있으면: 토큰 저장 정책·401 재발급 단일비행 큐·라우터 가드까지. 런타임 검증이 실 백엔드를 요구하면 구조만 만들고 manual_review 에 기록.

## 출력
- 이후 화면 Step 이 shared/features 인프라만으로 조립 가능한 상태.

## 실패처리 / 다음 phase
- 자가수정 3회. → 첫 화면 Step.
