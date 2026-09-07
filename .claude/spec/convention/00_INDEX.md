# convention — 소스코드에서 걷어낸 규칙·근거 모음

원본(`sugang.inu.ac.kr`) 재현 프로젝트라 코드 곳곳에 **"왜 이렇게 짰는지"** 가 주석으로 붙어 있었다.
구현이 끝난 뒤 소스에서는 설명형 주석을 걷어내고, **정책·근거·재현 규칙만** 이 폴더로 옮겼다.

## 읽는 법
- 소스에는 회귀 위험이 큰 지점에만 한 줄 포인터가 남아 있다 — `// 규칙 → .claude/spec/convention/02_ui.md §7`.
- 여기 적힌 값·규칙을 바꾸려면 **먼저 `.claude/rules/decisions.md`(D1~)를 확인**한다. 확정 결정을 우회하는 변경은 금지.
- 상위 권위 순서는 `.claude/rules/source-of-truth.md` §2 를 따른다. 실측 대조 결정(D50·D51·D52·D53·D54)이
  SoT 문서(`04`·`05`)보다 우선한다 — 이 폴더의 서술도 그 실측값 기준이다.

## 문서
| 파일 | 담는 것 |
|---|---|
| `01_data.md` | 어댑터 경계 · 도메인 모델/스키마 · enum·코드 · 에러 카탈로그 · http 계약 · 세션 · 쿼리 훅 · env |
| `02_ui.md` | 전역 골격 · perT · 메뉴 탭 · 검색행 · 안내 박스 · 결과 테이블 · 컬럼 폭 · 신청내역 · 4상태 |
| `03_login_captcha.md` | 로그인 화면 · CAPTCHA 게이트/모달/이미지 |
| `04_mock.md` | mock 어댑터 · 시드 픽스처 · 서버 검증 시뮬레이션 |

## 소스 → 문서 매핑
| 소스 | 문서 |
|---|---|
| `features/sukang/api.ts` · `api/index.ts` · `api/types.ts` | `01_data.md` §1 |
| `features/sukang/schemas.ts` | `01_data.md` §2 |
| `features/sukang/constants/codes.ts` | `01_data.md` §3 |
| `features/sukang/constants/messages.ts` | `01_data.md` §4 |
| `features/sukang/api/httpApi.ts` · `shared/api/client.ts` · `shared/api/serverTime.ts` | `01_data.md` §5 |
| `shared/session/store.ts` | `01_data.md` §6 |
| `features/sukang/hooks.ts` · `queryKeys.ts` | `01_data.md` §7 |
| `shared/config/env.ts` · `shared/constants/fieldLimits.ts` | `01_data.md` §8 |
| `features/sukang/components/SukangShell.tsx` · `app/*` | `02_ui.md` §1 |
| `components/PerTable.tsx` | `02_ui.md` §2 |
| `components/MenuTabs.tsx` · `constants/screens.ts` | `02_ui.md` §3 |
| `components/ScreenTitle.tsx` · `SearchSpacer.tsx` · `SearchSelect.tsx` · `SearchLinkedSelect.tsx` · `SearchText.tsx` | `02_ui.md` §4 |
| `components/GuideBox.tsx` · `constants/notices.ts` · `screens/LandingScreen.tsx` | `02_ui.md` §5 |
| `components/CourseTable.tsx` · `CourseTitleCell.tsx` · `ActionButton.tsx` · `ResultArea.tsx` · `CourseScreen.tsx` | `02_ui.md` §6 |
| `features/sukang/columns.ts` | `02_ui.md` §7 |
| `components/EnrollmentArea.tsx` · `EnrollmentTable.tsx` · `PrintButtons.tsx` | `02_ui.md` §8 |
| `features/sukang/tableStatus.ts` · `useErrorAlert.ts` · `useEnrollFlow.tsx` · `errors.ts` · `shared/lib/*` | `02_ui.md` §9 |
| `features/sukang/screens/*.tsx` | `02_ui.md` §10 |
| `features/login/*` · `app/main.tsx` | `03_login_captcha.md` §1 |
| `features/sukang/captcha/*` | `03_login_captcha.md` §2 |
| `features/sukang/api/mock/*` | `04_mock.md` |

## 다루지 않는 것
- `src/shared/styles/globals.css` 의 주석은 **그대로 둔다** — 원본 CSS 어느 규칙을 이식했는지 대조하는 메모라
  원본 재확인 작업에 계속 쓰인다.
