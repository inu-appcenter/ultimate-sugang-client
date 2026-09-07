# ultimate-sugang-client

인천대학교 수강신청 사이트(`sugang.inu.ac.kr`)를 화면 단위로 재현한 **연습용 모의 클라이언트**.
수강신청 당일의 조작 순서와 실패 메시지를 미리 겪어 보는 것이 목적이라, 편의 기능을 더하지 않고 원본 동작을 그대로 따릅니다.

> 학교와 무관한 비공식 프로젝트입니다. 실제 수강신청과 연결되지 않습니다.

## 기술 스택

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind&perline=6" alt="React, TypeScript, Vite, Tailwind CSS" />

TanStack Query · Zustand · React Hook Form + Zod · axios · React Router · Playwright

원본 CSS 를 이식한 프로젝트라 UI 라이브러리를 쓰지 않고, 다이얼로그는 네이티브 `alert`/`confirm` 입니다.

## 시작하기

```bash
npm install
npm run dev      # http://localhost:5173 — 학번에 아무 값이나 넣으면 진입
```

서버 없이 바로 돕니다. 기본값이 인메모리 mock(시드 강좌 72건)이라 조회·신청·취소·검증 실패까지 재현됩니다.

```bash
npm run build                                  # 타입 검사 + 프로덕션 빌드
npm run typecheck && npm run lint
npx playwright test .claude/resource/smoke     # 스모크 13건
```

## 구조

```
src/
├── app/                  부트스트랩 — 라우터, 프로바이더
├── pages/                라우트별 얇은 페이지
├── features/
│   ├── login/            로그인 화면
│   └── sukang/           수강신청 도메인
│       ├── api.ts        단일 진입점 — 어댑터 출력을 Zod 로 파싱
│       ├── api/          어댑터: mock(인메모리 시드) | http(실서버)
│       ├── schemas.ts    Course · Student · Enrollment
│       ├── columns.ts    화면별 컬럼 정의와 폭
│       ├── hooks.ts      조회·신청·취소 쿼리 훅
│       ├── constants/    코드·메시지·안내 문구·화면 메타
│       ├── captcha/      매크로 방지 모달
│       ├── components/   셸, 학적 정보, 메뉴 탭, 검색행, 결과 테이블, 신청내역
│       └── screens/      탭 7종 + 랜딩
└── shared/               도메인 무관 공용 — axios, 세션, 라우트 상수, 전역 CSS

.claude/                  이 앱을 만든 스펙 주도 빌드 하네스(명세·규칙·게이트·스모크)
intake/                   원본 명세·시드 데이터 (커밋 제외)
```

의존 방향은 `app → pages → features → shared` 단방향이고, import 는 `@/` 절대경로만 씁니다.
