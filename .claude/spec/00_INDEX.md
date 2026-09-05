# 00 — SoT 인덱스 (INU 수강신청 모의 사이트)

> 프로젝트: **inu-sugang-mock** — INU(인천대) 수강신청 사이트(sugang.inu.ac.kr, 2026-2학기)의 **연습용 모의 사이트**. UI/UX 재현 + 자체 백엔드(계약 미제공). 원본 명세: `intake/INU-수강신청-모의사이트-명세.md`(조사일 2026-09-04). init: 2026-09-06.
> 이 폴더(`.claude/spec/`)는 **phase=BUILD 부터 읽기전용**(이 파일만 예외). 사실은 오직 여기서만 — 추측 금지, 없으면 🙋🏻.

## §1. 문서 목록·성격
| 문서 | 성격 | 내용 |
|---|---|---|
| `01_behavior_spec.md` | **사실 재구성**(창작 없음) | 제작 원칙·IA·화면 목록·데이터 사전·검색 동작·컬럼 매트릭스·신청/취소 플로우·메시지·로그인·서버 시뮬레이션 대응·🙋🏻 질문 목록(§11) |
| `02_api_spec.md` | **사실 재구성**(창작 없음) | ⚠️ 엔드포인트 **미제공**. 데이터 모델·필요 오퍼레이션(계약 아님)·서버 검증·에러 종별/메시지·enum(교양 트리·타학과 76·연계전공 32·placeholder) |
| `03_frontend_spec.md` | **하네스 계획**(창작 허용) | 스택(편차 포함)·**§2 정합성 노트(N-1~24 = D 매핑)**·어댑터 계층(mock 기본)·디렉토리·횡단정책·**§6 Step 계획**·셋업·env·QA |
| `04_design_system.md` | 사용자 제공 재구성 + 보충 | 토큰(타이포·색·테두리·크기)·컬럼 폭·폰트 정책·컴포넌트 카탈로그·CSS 이식 원칙·실측 |
| `05_screens_spec.md` | 사용자 제공 재구성 + init 도출(시각) | 전역 레이아웃·LOGIN·MAIN_SHELL·결과 테이블 공통·탭 화면 7·신청내역·상호작용·gap 화면·보완 항목 |

## §2. 관할 (어느 문서가 무엇의 권위인가)
| 영역 | 권위 |
|---|---|
| 화면 동작·IA·상태전이·검증 규칙·데이터 사전·메시지 문구 | `01` |
| 데이터 모델·오퍼레이션 목록·서버 검증·에러 종별·enum/코드·placeholder 원문 | `02` |
| 스택·폴더·어댑터·횡단정책·Step 계획·충돌 해소 | `03`(+ `rules/decisions.md`) |
| 토큰 값·컴포넌트 명명·상태 변형·CSS 이식 | `04`(+ `globals.css` 기술 베이스) |
| 화면 배치·마크업 골격·상호작용 패턴 | `05` |

## §3. 충돌 우선순위 (위가 이긴다)
1. **명시적 결정** — `03 §2` 정합성 노트 · `rules/decisions.md`(D1~D22).
2. 해당 영역의 관할 문서(§2 표).
3. 그 외 문서.
4. 코드 ↔ spec 충돌 → 항상 spec. 코드를 spec 에 맞춘다.

## §4. 멈춤 규칙
- spec 에 없거나 모순이고 §3 으로도 해소 안 되면 **코드 작성 금지 → 🙋🏻**. 엔드포인트/필드/화면 창작 금지.
- **Q-5·Q-6 은 차단 질문**: `step-7:PRINT_CHECK`·`step-7:PRINT_APPLY`·`step-7:WAITING_ROOM` 은 답변 전 진행 금지(미답 시 SKIPPED).
- Q-1 은 D1(mock 어댑터)로 우회 — 단 **http 어댑터는 계약 도착 전 구현 금지**.
- Figma 없음 → 시각은 `05` → `04` 순으로 자체 완성(중단 없음). 동작/데이터 gap 은 멈춤.

## §5. 식별자 매핑
### 화면 ID ↔ 원본 키 ↔ 체크리스트
| SCREEN_ID | 원본 키 | 화면명 | 체크리스트 id | 01 | 05 |
|---|---|---|---|---|---|
| `LOGIN` | — | 로그인 | `step-3:LOGIN` | §7 | §2 |
| `MAIN_SHELL` | — | 메인 골격 | `step-3:MAIN_SHELL` | §2-2 | §3 |
| `ENROLLMENT_LIST` | — | 수강신청내역 | `step-3:ENROLLMENT_LIST` | §6 | §6 |
| `JUNGONG` | `Jungong` | 전공과목 | `step-4:JUNGONG` | §4-3 | §5 |
| `HUSS` | `Huss` | HUSS전공과목 | `step-4:HUSS` | §4-7 | §5 |
| `BASKET` | `Basket` | 장바구니 | `step-4:BASKET` | §4-2 | §5 |
| `TAGWA` | `Tagwa` | 타학과과목 | `step-5:TAGWA` | §4-5 | §5-2 |
| `YUNGAE` | `Yungae` | 연계전공과목 | `step-5:YUNGAE` | §4-6 | §5-2 |
| `GYOYANG` | `Gyoyang` | 교양과목 | `step-6:GYOYANG` | §4-4 | §5-1 |
| `CUSTOM` | `Custom` | 과목명(코드) 조회 | `step-6:CUSTOM` | §4-8 | §5-3 |
| `PRINT_CHECK` | `goPrint('check')` | 확인서출력 | `step-7:PRINT_CHECK` | §9 | §8 |
| `PRINT_APPLY` | `goPrint('apply')` | 시간표출력 | `step-7:PRINT_APPLY` | §9 | §8 |
| `WAITING_ROOM` | — | 대기열 | `step-7:WAITING_ROOM` | §8 | §8 |

### 약어
- `원§n` = 원본 명세(intake) 섹션 · `01 §4-4` = SoT 인용 · `D-n` = `rules/decisions.md` · `N-n` = `03 §2` 정합성 노트 · `O-n` = `02 §3` 오퍼레이션 · `Q-n` = 🙋🏻 질문.
- 검색 패턴: ① 조건 없음(Basket·Jungong·Huss) ② 단일 select(Tagwa·Yungae) ③ 연동 select/텍스트(Gyoyang·Custom).

## §6. 🙋🏻 질문 색인 (상세·기본값 = `01 §11`)
| # | 한 줄 | 차단 |
|---|---|---|
| Q-1 | 백엔드 API 계약 미제공 → D1 mock 어댑터로 진행 승인? | D1 승인 시 해제 |
| Q-2 | 시드 데이터 출처(강좌·장바구니·학생) | — |
| Q-3 | 원본 UX 결함 3건 그대로 재현?(D4) | — |
| Q-4 | CAPTCHA 미구현 확정?(D3) | — |
| Q-5 | 확인서출력·시간표출력 화면 내용 | **차단**(step-7) |
| Q-6 | 대기열 화면 문구·트리거 | **차단**(step-7) |
| Q-7 | 검색 조건 미충족 시 동작 | — |
| Q-8 | 초기 탭 | — |
| Q-9 | 로그인 빈 값·찾기 링크·바로가기 동작 | — |
| Q-10 | 앱 명칭·배너 위치·불릿 gif | — |
| Q-11 | 헤더 en 라벨 누락 2건 | — |
| Q-12 | 탭 활성·행 hover 스타일 | — |
| Q-13 | 세션 만료 귀결·타임아웃 메시지·서버 시간 UI | — |
| Q-14 | 학점 상한·status enum·이수구분 전체·원어여부 필드·select 코드값 | — |
| Q-15 | 대체 웹폰트 | — |

## §7. 관련 규칙(자동 로드)
`rules/source-of-truth.md` · `rules/decisions.md` · `rules/api-contract.md` · `rules/ui-conventions.md` · `rules/architecture.md` · `rules/good-patterns.md` · `rules/antipatterns.md` · `rules/hooks.md`
