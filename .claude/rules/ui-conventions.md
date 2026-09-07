# 규칙 — UI·디자인 토큰 컨벤션

> 근거: **`04_design_system.md`** = 토큰·컴포넌트 권위, **`05_screens_spec.md`** = 화면 시각·상호작용 명세. 특정 시각 디테일이 명세에 없거나 모순일 때만 멈춰 질문(🙋🏻).

## 불변 (token-lint 가 강제 → [[hooks]])
- raw hex·하드코딩 arbitrary 값(`#fff`, `[13px]`) 금지. 색/간격/타이포는 **토큰만** 사용.
- 토큰 정의는 `globals.css`(CSS 변수) + `tailwind.config.ts` 에만(=token-lint allow 대상). 그 외 파일에서 토큰 정의 금지.
- 뷰포트/테마 정책(아래 PROJECT 블록)을 벗어난 코드 금지(예: 데스크탑 전용인데 반응형 breakpoint 작성).

<!-- PROJECT:BEGIN — harness-init 이 채운다. 명세 부재 시 하네스 기본값(데스크탑 1280px+ 단일 폭, 라이트 모드 전용)을 적용하고 decisions 에 기록. -->
## 뷰포트·테마 정책
- **데스크탑 전용**: `.wrap { width:80%; min-width:1400px }`(원§6). 반응형 breakpoint(`sm:`·`md:`…)·미디어쿼리 **작성 금지**. 1400px 미만은 가로 스크롤(원본 동일).
- **라이트 모드 전용**: `dark:`·`prefers-color-scheme` 금지.
- 브라우저: Chrome/Edge 기준(원본). 차단 로직은 만들지 않는다.
- **원본 CSS 이식 프로젝트**(D2): shadcn/ui·sonner 미도입. 예외 1건 — CAPTCHA 모달은 원본과 같은 **jquery-confirm CSS** 를 실제로 설치해 쓴다(D54). 컴포넌트는 원본 클래스명(`perT`·`dataT`·`btn_blue`…)을 쓰고 `globals.css` 가 원§6 CSS 를 `var(--토큰)` 으로 치환해 담는다(`04 §4`). 다이얼로그는 `window.alert`/`confirm` 만(예외: CAPTCHA 모달 D34). `border-radius` 전 요소 0. 폰트 스택 `Dotum, Gulim, 돋움, 굴림, arial, sans-serif`(원§7 원문). **웹폰트 미도입** — `'Nanum Gothic'`·`@fontsource` 는 D50 에서 제거(측정 머신에 Dotum/Gulim 이 없을 때 원본도 시스템 sans-serif 로 렌더되므로 웹폰트를 얹으면 폭이 어긋난다). 전역 `line-height: normal`(D50 — preflight 의 1.5 를 되돌림).
- **비밀번호 필드는 로그인 화면 1개만**(D54 D5-02 — 시각 재현 전용, 값 미사용). 그 외 화면 금지.
  연습용 배너는 **제거**(D52 D3-02 — D11 폐기). 문서 제목 `인천대학교 모의 수강신청`.
- 전역 `a:hover { color: var(--login-hint) }`(D54 D5-06) — `<a>` 전부(메뉴 탭 포함)에 걸린다. 버튼별 hover 규칙을 새로 만들지 않는다.

## 토큰 ↔ Tailwind 클래스 명명 매핑 (명명 SoT)
> **값의 SoT** = `04_design_system.md`(디자인 값) + `globals.css`(CSS 변수 = 기술 베이스). **이 표는 명명 매핑만** 담는다(hex/px 값 복붙 금지). shadcn 미도입이므로 변수명 충돌 없음 — 토큰명은 원§7 이름 그대로. ⚠️ 가독성 별칭 2개만: `--text`→`body`, `--border`→`line`(`text-text`·`border-border` 회피).

| 토큰명(04) | Tailwind 클래스 | CSS 변수 | 용도 |
|---|---|---|---|
| font-family | `font-dotum`(body 기본) | `--font-family` | 전역 폰트 |
| font-tiny / small / base / login-btn / header | `text-tiny` `text-small` `text-base` `text-login-btn` `text-header` | `--font-tiny` … `--font-header` | 10/11/12/13/14px |
| navy-900 | `bg-navy-900` | `--navy-900` | `.titY` 배경 |
| blue-label / blue-header / blue-topline | `bg-blue-label` `bg-blue-header` `border-blue-topline` | 동명 | perT 라벨 / dataT th / th 상단선 |
| blue-en | `text-blue-en` | `--blue-en` | 영문 라벨 `span.th-en` |
| blue-text / blue-border / blue-print | `text-blue-text` `border-blue-border` `bg-blue-print` | 동명 | 신청 버튼 / 확인서출력 |
| orange | `bg-orange` | `--orange` | 시간표출력 |
| red-border / red-text | `border-red-border` `text-red-text` | 동명 | 취소 버튼 |
| ⚠️ text | `text-body` | `--text` | 본문 글자 |
| guide-bg / guide-border | (없음 — CSS 전용 `.guide_box`) | 동명 | 조회 전 안내 박스 본문·테두리(D51 D2-01) |
| em-blue / em-red | (없음 — CSS 전용 `.em_blue`·`.em_red`) | 동명 | 안내 박스 강조 줄(D51 D2-01) |
| btn-sch-bg / btn-sch-bd-lt / btn-sch-bd-dk | (없음 — CSS 전용 `.btn_search`) | 동명 | 조회 버튼 배경·양각 테두리(D51 D2-04) |
| font-guide / font-tit-en | (없음 — CSS 전용) | 동명 | 안내 박스 11pt · `.tit_sub` 영문 13px(D51) |
| text-muted | `text-muted` | `--text-muted` | 마감·비활성 |
| maroon | `text-maroon` | `--maroon` | 야간학과·`em` |
| cyan | `text-cyan` `bg-cyan` | `--cyan` | `.blue`(미사용)·timeT |
| ⚠️ border | `border-line` | `--border` | 셀 테두리 |
| border-lt / border-tab / border-sch / border-input | `border-line-lt` `border-line-tab` `border-line-sch` `border-line-input` | `--border-lt` `--border-tab` `--border-sch` `--border-input` | perT / 탭 / 검색영역 하단 / 입력·로그인 버튼 |
| bg-btn / bg-tab / bg-noti | `bg-btn` `bg-tab` `bg-noti` | 동명 | 버튼 / 탭·바로가기 / 안내 영역 |
| white | `text-white` `bg-white` | `--white` | 반전 글자 |
| grey-sch | `bg-grey-sch` | `--grey-sch` | 조회 버튼 배경 |
| noti-blue | `text-noti-blue` | `--noti-blue` | 신청내역 헤더 문구 |
| tag-blue | `text-tag-blue` | `--tag-blue` | 교과목명 태그 |
| login-navy / login-divide / login-hint / btn-bg / etc-border | `bg-login-navy` `border-login-divide` `text-login-hint` `bg-btn-bg` `border-etc-border` | 동명 | 로그인 화면 (`--login-input` 은 D54 D5-03 로 미사용 — 정의만 존치) |
| login-title / black | `text-login-title` `text-black` | 동명 | 제목 `대학 수강신청` / `인천대학교`·CAPTCHA 글자(D54 D5-01) |
| font-login-logo / font-login-h1 | `text-login-logo` `text-login-h1` | 동명 | 로고 48px · h1 24px(D54 §5.12) |
| time-th / time-sun / time-sat | `bg-time-th` `bg-time-sun` `bg-time-sat` | 동명 | PRINT_APPLY(D23: 화면 미구현 — 미사용) |
| row-hover | `bg-row-hover` | `--row-hover` | `.sch_areaT table.dataT tbody tr:hover` = `#E1F1FF`(D52 D3-09) |
| slate-title | (없음 — `.tit_scr` 전용) | `--slate-title` | 화면 제목 `>>` 접두(D50) |
| capt-bg-1~4 / capt-line | (없음 — canvas 전용) | 동명 | CAPTCHA 이미지 배경 4색 로테이션·노이즈(D54, `getComputedStyle` 로 읽음) |
| capt-box-bd / capt-input-bg | (없음 — CSS 전용 `.capt_box`·`.capt_field`) | 동명 | CAPTCHA 본문 박스 테두리·입력창 배경(D54) |
| w-capt-box / w-capt-inner / h-capt-inner / w-capt-img / font-capt-title / lh-capt-err | (없음 — CSS 전용) | 동명 | CAPTCHA 모달 치수(D54 §5.13). 나머지 시각은 **jquery-confirm 벤더 CSS** 가 담당 |
| radius | (없음 — 전부 0) | `--radius` | `borderRadius` 전체 0 |
| h-result / minw-wrap / h-input / w-search-input 등 크기 | `h-result` `min-w-wrap` `h-input` `w-search-input` `w-login-input` `w-login-btn` `h-login-btn` `w-print` `h-print` | `04 §1-4` 동명 | 주로 globals.css 이식 규칙에서 사용; TSX 에서 필요 시 이 클래스만 |
| 간격 sp-* | `p-cell-y` `px-cell-x` `p-data-y` `px-data-x` `pl-ltf` `p-btn` `p-tab` `mb-perT` `mb-sch` `pb-sch` `mb-regi` `mb-btnarea` | `04 §1-4` 동명 | 이식 CSS 가 담당 — TSX 에서 arbitrary 값 금지 |
- **컬럼 폭은 토큰이 아니다**(D10): `features/sukang/columns.ts` 의 설정 데이터(원§3) → `<colgroup>` `style={{width}}`. `table.perT` 도 동일(`PER_TABLE_COL_WIDTHS` = `22/12/14/12/14/12/14%`, D50) — `<colgroup>` 없으면 fixed 레이아웃이 7등분한다.

## 글로벌 레이아웃 (`05 §1`)
- 사이드바·헤더 없음. 단일 `.wrap`(80%, min 1400px, padding 10px) 안에 위→아래: `perT` → `.btn_area`(탭 7 + 주의 문구 `.noti` 가 **마지막 탭 뒤 인라인**, 간격 4.3px — D52 D3-01·D3-08) → 검색행 `.sjt_sch`(좌 20px 들여쓰기 · 높이 25px · 하단 여백·구분선 없음 — D52 D3-03·D3-05·D3-06) → **[조회 전 `.guide_box` | 조회 후 `.sch_areaT`(337px 스크롤)]**(D51 D2-01 — 둘은 교체 관계, 안내 문구는 박스 안에만) → `.regi_area`(제목 `div.tit_sub` **안에** 출력 버튼 `div.tit_btns{float:right}` → `div.leftT` > 신청내역 테이블 — D52 D3-10·D3-11).
- 검색행은 `<table>` 이고 요소 간격은 **`width="10px"` 스페이서 `<td>`**(`SearchSpacer`)가 만든다. 이 테이블은 원§8.4 인라인 style(`font-weight:bold; font-size:9pt; font-family:굴림; text-align:center`)을 그대로 갖는다 — `font-family:굴림`(폴백 스택 없음)이 제목 56.4·`→` 10.4 폭을 만든다(D52 D3-03).
- 폼 컨트롤(`input`·`select`)은 **UA 기본 스타일 그대로**(D51 D2-08·D2-09). `.sjt_sch` 의 200×32 규칙·`.btn_sch` 는 미적용 규칙이다. 단 `select` 는 `text-align:center`(위 테이블 상속분을 UA 가 덮으므로 명시 — D52 D3-07).
- 로그인: `#login` 928×380 절대 중앙(`05 §2`).
- 테이블: `table-layout: fixed`, 결과 영역은 `.sch_areaT`(337px), **신청내역은 `.leftT`(320px) 내부 스크롤**(둘 다 `box-sizing: content-box` D40 · D52 D3-10). 행 hover 배경 `--row-hover`(D36). 표 셀 `vertical-align: middle`(UA 상속 — `*` 리셋에 `baseline` 금지, D50).
- 화면 제목 `>> 화면명` = `.tit_scr`(bold · `--slate-title` · 12px · center, D50). 평문 아님.
- 랜딩 상태(D35): `?menu` 없음/무효 → 제목·검색·결과 영역 미렌더, 전공과목 안내만 + 신청내역.
- 로그인 `#login` 은 transform 중앙 정렬(D36, 배너 포함 보정).
<!-- PROJECT:END -->
## Figma 사용 정책 (있을 때 / 없을 때 — fill, not invent)
화면 구현은 Figma URL 인테이크(선택)로 시작한다(implement-one-screen §0). **Figma 는 시각 한정** 참조다.

**시각 우선순위**: Figma 프레임(있으면, 가장 구체) → `05`(화면 시각 명세) → `04` 토큰 + 기존 구현 화면 관례.

- **Figma 있을 때**: 레이아웃·구성·간격 의도의 1차 참조. 값(색·px·타이포)은 **04 토큰으로 매핑**한다.
  - Figma 에만 있고 토큰에 없는 값 → **가장 가까운 토큰 사용. 새 토큰·raw 값 임의 추가 금지, 사용자 질문 금지.**
  - 레이아웃·구성은 Figma 우선(명세가 추상적일 때). 단 전역 invariant(뷰포트·테마 정책)와 동작/데이터/계약(01/02/03)은 **고정** — Figma 무권한.
  - 브랜드/일러스트 특수 화면 예외는 사용자 승인 + [[decisions]] 기록 시에만 해당 화면 한정 허용.
- **Figma 없을 때(또는 URL 미제공)**: 위 우선순위로 **자체 완성. 중단·질문 안 함.**
- **공통(시각 한정)**: 동작·필드·엔드포인트·검증 규칙은 Figma 무권한 — 명세에 없으면 만들지 않는다. Figma 사용 여부/자체 보완 항목은 **리뷰 패킷 §C 에 표시**(사후 검수용).
- 명세·토큰·Figma 어디에도 시각 근거가 전혀 없고 추정이 과할 때만 멈춰 질문(🙋🏻).

## 컴포넌트 원칙
- **shadcn/ui 우선**. 커스텀은 shadcn/ui 확장 + 디자인 토큰 경유로만.
- 아이콘 `lucide-react`. 위험 액션은 destructive 계열.

## 공통 패턴 (05)
- 목록: 테이블/그리드 + (해당 화면만)검색·필터 + 페이지네이션. **4상태 = Empty/Loading(skeleton)/Error/Data 모두 구현.**
- 모달 닫기 = ESC/외부클릭/X. 토스트 `sonner` 자동 dismiss.
- 세부 규격(모달 폭, 배지 variant 매핑 등)은 05 와 PROJECT 블록이 권위.

관련: [[good-patterns]] · [[antipatterns]] · [[decisions]]
