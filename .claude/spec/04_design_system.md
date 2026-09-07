# 04 — 디자인 시스템 (Design System)

> **출처**: `intake/INU-수강신청-모의사이트-명세.md` 원§5(마크업 골격)·원§6(CSS 전문)·원§7(디자인 토큰·컴포넌트 실측)·원§8.6(안내 영역 배경). **사용자 제공분 재구성.** 원§7 토큰 목록에 없으나 원§6 CSS 에 존재하는 값은 **보충 토큰**으로 추가하고 출처를 표기했다(하네스 창작 아님 — D13). 하네스 기본값을 쓴 곳은 `§7` 에 모아 D 번호로 표기.
> **관할**: 디자인 토큰·컴포넌트 명명·상태 변형·아이콘. 화면 배치는 `05`. **값의 SoT = 이 문서 + `globals.css`**(기술 베이스). Tailwind 클래스 명명 매핑은 `rules/ui-conventions.md` PROJECT 블록.
> 인용: `04 §1-2`.

---

## §1. 토큰

### §1-1. 타이포그래피 (원§7)
| 토큰(CSS 변수) | 값 | Tailwind | 용도 |
|---|---|---|---|
| `--font-family` | `Dotum, Gulim, 돋움, 굴림, 'Nanum Gothic', arial, sans-serif` | `font-dotum`(body 기본) | 전역. Dotum/Gulim 부재 시 웹폰트 **Nanum Gothic**(@fontsource, OFL) — **D36**(D18 대체). Arial 폴백은 재현 실패 |
| `--font-tiny` | `10px` | `text-tiny` | 영문 라벨(`span.th-en`, 원 `<font size="1">`) |
| `--font-small` | `11px` | `text-small` | 메뉴 탭·신청/마감/취소·출력 버튼·안내(`.noti`·`.noti_blue`) |
| `--font-base` | `12px` | `text-base` | 본문·테이블 셀·input/select |
| `--font-login-btn` | `13px` | `text-login-btn` | 로그인 버튼(원§6 `.btn_login`, 보충) |
| `--font-header` | `14px` | `text-header` | 상단 학기 헤더 `.titY`·팝업 제목·`.tit_sub` |
- 굵기: 라벨/헤더/버튼 `bold`, 본문 normal. `em { font-style: normal }`.
- **재현 핵심 3**(원§7): ① Dotum/Gulim 폰트 ② `border-radius: 0` 전 요소 ③ 12px 본문 / 11px 버튼 — 키우면 밀도가 달라진다.

### §1-2. 색 (원§7 + 보충)
**본문 화면**
| 토큰 | 값 | 용도 | 출처 |
|---|---|---|---|
| `--navy-900` | `#0F4EAB` | 상단 헤더 `.titY` 배경 | 원§7 |
| `--blue-label` | `#D6DFF0` | `.perT` 라벨 셀 배경 | 원§7 |
| `--blue-header` | `#E0E8F5` | `.dataT th` 배경 | 원§7 |
| `--blue-topline` | `#3E74BA` | `.dataT th` 상단선 2px | 원§7 |
| `--blue-en` | `#16529B` | 영문 라벨 | 원§7 |
| `--blue-text` | `#004096` | 신청 버튼 글씨(`.btn_blue`·`.btn_mrc`) | 원§7 |
| `--blue-border` | `#1F5CB7` | 신청 버튼 테두리 | 원§7 |
| `--blue-print` | `#306FB6` | 확인서출력 배경 | 원§7 |
| `--orange` | `#D95C00` | 시간표출력 배경 | 원§7 |
| `--red-border` | `#C80606` | 취소 버튼 테두리 | 원§7 |
| `--red-text` | `#CA0000` | 취소 버튼 글씨 | 원§7 |
| `--text` | `#333333` | 본문 글자·링크 | 원§7 |
| `--text-muted` | `#848484` | 마감강좌·비활성·`.noti span`·`.btn_grey2` | 원§7 |
| `--maroon` | `#800000` (`maroon`) | 야간학과 행·`.noti em` | 원§7 |
| `--cyan` | `#0082A7` | `.dataT .blue`(용도 미확인)·`.timeT .blue2` | 원§7 |
| `--border` | `#B7B7B7` | 테이블 셀 테두리·`.sch_areaT`·`.timeT .grey2` | 원§7 |
| `--border-lt` | `#CCCBC9` | `.perT` 셀 테두리 | 원§7 |
| `--border-tab` | `#CDCDCD` | 메뉴 탭 테두리 | 원§7 |
| `--bg-btn` | `#F2F2F2` | 신청/마감/취소 버튼 배경 | 원§7 |
| `--bg-tab` | `#F3F3F3` | 메뉴 탭·바로가기 배경 | 원§7 |
| `--white` | `#FFFFFF` | `.titY` 글자·`.btn_sch`·출력 버튼 글자·로그인 라벨 | 원§6(`#fff`, 보충) |
| `--border-sch` | `#CBCBCB` | `.sjt_sch` 하단 구분선 | 원§6(보충) |
| `--border-input` | `#CFCFCF` | 검색 텍스트 입력 테두리·`.btn_login` 테두리 | 원§6(보충) |
| `--grey-sch` | `#616161` | `.btn_sch`(조회 버튼) 배경 | 원§6(보충) |
| `--noti-blue` | `#1958A8` | `.noti_blue`(신청내역 헤더 문구) | 원§6(보충) |
| `--bg-noti` | `#EFF5FC` | 화면별 안내 영역 배경("계열" — 근사값) | 원§8.6(보충) |
| `--tag-blue` | `#0000FF` (`blue`) | 교과목명 태그 `[75분수업]` 등(원 `<font color="blue">`) | 원§5.5(보충) |
| `--row-hover` | `#F5F8FD` | `.dataT tbody tr:hover` 배경(원 `listColorOn/Off` 대응) | **D36** 사용자 지정(2026-09-06) |

**CAPTCHA 모달(D34 — 원§9.1 "배경색 랜덤: 주황/노랑 관측" 근사)**
| 토큰 | 값 | 용도 | 출처 |
|---|---|---|---|
| `--captcha-bg-orange` | `#F5A623` | 이미지 배경 후보 1 | 하네스 근사 |
| `--captcha-bg-yellow` | `#F8E71C` | 이미지 배경 후보 2 | 하네스 근사 |
| `--captcha-overlay` | `rgba(0,0,0,0.4)` | 모달 뒤 딤 | 하네스 |
> 숫자·노이즈 색은 `--text`·`--text-muted`, 박스 테두리 `--blue-border`, 에러 문구 `--blue-text`(파란 굵은 글씨) 재사용.

**로그인 화면**
| 토큰 | 값 | 용도 | 출처 |
|---|---|---|---|
| `--login-navy` | `#094A9A` | 로그인 박스 `.login_con`·공지 팝업 헤더 | 원§7 |
| `--login-divide` | `#46639B` | 입력영역 우측 구분선 | 원§7 |
| `--login-input` | `#E0E0E0` | 로그인 입력 필드 배경 | 원§7 |
| `--login-hint` | `#E2E0E1` | 안내 문구 `.txt` | 원§7 |
| `--btn-bg` | `#F6F6F6` | 로그인 버튼 배경 | 원§7 |
| `--etc-border` | `#DFDFDF` | 바로가기 테두리 3px | 원§7 |
> ⚠️ 본문 헤더 `#0F4EAB`(`--navy-900`)와 로그인 박스 `#094A9A`(`--login-navy`)는 **다른 남색**이다. 통일하지 말 것(원§7).

**시간표 출력 화면(`PRINT_APPLY` — Q-5 전 미사용)**
| 토큰 | 값 | 용도 | 출처 |
|---|---|---|---|
| `--time-th` | `#D3D3D3` | `.timeT th` 배경(상단선 `#3D75BB` ≈ `--blue-topline` 대체 사용) | 원§6 |
| `--time-sun` | `#F6E0E0` | `.timeT .sun` | 원§6 |
| `--time-sat` | `#C3DDEF` | `.timeT .sat` | 원§6 |
> `.timeT th` 상단선 `#3D75BB` 는 `--blue-topline`(`#3E74BA`)과 1단계 차이 — 별도 토큰 두지 않고 `--blue-topline` 으로 통일(D13, 출력 화면 한정·Q-5 답변 시 재확인).

### §1-3. 테두리·모서리
| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius` | `0` | **전 요소**(원§7 재현 핵심 2). Tailwind `borderRadius` 전부 0 |
| 선 두께 | `1px` 기본 / `2px`(`.dataT th` 상단·`.sch_areaT` 하단) / `3px`(`.btn_etc` 테두리) | 원§6 |

### §1-4. 크기·간격 (원§7 실측 + 원§6)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--w-wrap` / `--minw-wrap` | `80%` / `1400px` | `.wrap` 폭·최소폭 |
| `--sp-wrap` | `10px` | `.wrap` padding |
| `--h-result` | `337px` | `.sch_areaT`·`.sch_areaSubT` 높이 |
| `--h-input` | `32px` | 검색 텍스트 입력·로그인 입력·`.btn_sch` |
| `--w-search-input` | `200px` | 검색 텍스트 입력 |
| `--w-login-input` | `184px` | 로그인 입력 |
| `--w-login-btn` / `--h-login-btn` | `86px` / `72px` | 로그인 버튼(2행에 걸침) |
| `--w-login` / `--h-login` / `--h-login-con` | `928px` / `380px` / `306px` | 로그인 박스 |
| `--h-etc` | `43px` | 바로가기 버튼 |
| `--w-print` / `--h-print` | `148px` / `24px` | 확인서출력·시간표출력(실측) |
| `--w-captcha` | `520px` | CAPTCHA 모달 폭(D34, 하네스 기본값) |
| `--sp-cell-y` / `--sp-cell-x` | `10px` / `15px` | `.perT th,td` padding |
| `--sp-data-y` / `--sp-data-x` | `5px` / `3px` | `.dataT th,td` padding |
| `--sp-ltf` | `10px` | `.ltf`·`.timeInfo` padding-left |
| `--sp-btn` | `3px` | `.btn_blue/.btn_grey2/.btn_red/.btn_mrc` padding |
| `--sp-tab` | `5px` | `.btn_re`·`.btn_regiP`·`.btn_scheP` padding |
| `--sp-perT-mb` | `8px` | `.perT` margin-bottom |
| `--sp-sch-mb` / `--sp-sch-pb` | `20px` / `10px` | `.sjt_sch` margin/padding-bottom |
| `--sp-regi-mb` | `5px` | `.regi_top` margin-bottom |
| `--sp-btnarea-mb` | `10px` | `.btn_area` |
| 실측(참고) | 헤더 셀 h 53px · 탭 50×37 · th 행 h 38px · td 행 h 33px · 액션 버튼 **부모의 90%** × 22px | 원§7 — 고정폭 아님, padding 결과값 |

### §1-5. 컬럼 폭 (원§3 — **토큰 아님, 화면 설정 데이터**, D10)
전체 1378px(전공과목 기준), `table-layout: fixed`. 교과목명이 39%, 나머지 고정폭.
```
학년   이수구분  학수번호  교과목명  학점  원어여부  요일및교시  개설학과  교강사  신청
 50      70       80      543     50     65       250      125     80     65
```
- 다른 화면(컬럼 8~11)의 폭은 명세에 없음 → 동일 컬럼은 같은 폭을 쓰고, 제거된 폭은 교과목명이 흡수(`05 §4-5`, init 도출).
- 적용 위치: `features/sukang/columns.ts` → `<colgroup><col style={{width}}/>`.

---

## §2. 폰트 정책
- 스택: `Dotum, Gulim, 돋움, 굴림, 'Nanum Gothic', arial, sans-serif`(D36). `input[type=text], select, textarea { font-family: Dotum, Gulim, 'Nanum Gothic', sans-serif; font-size: 12px }`.
- **웹폰트 적용(D36, D18 대체)**: `@fontsource/nanum-gothic` 400/700 을 `main.tsx` 에서 import(자체 호스팅, OFL). Dotum/Gulim 이 있는 Windows 는 원 폰트가 우선, 없는 환경(macOS 등)은 Nanum Gothic. Arial 폴백은 재현 실패로 간주한다.
- 안티앨리어싱/자간 조정 금지(원본 재현).

---

## §3. 컴포넌트 카탈로그 (원본 클래스 ↔ React 컴포넌트, 상태 변형)

| 컴포넌트 | 원본 클래스/구조 | 상태 변형 | 비고 |
|---|---|---|---|
| `PracticeBanner` | (신규) `.noti` + `em` | — | D11. 문구 `01 §1` 필수 3 |
| `PerTable` | `table.perT` / `th.titY[scope=col]` / `th[scope=row]` + `td` ×3 쌍 | — | `05 §3-1` |
| `MenuTabs` | `a.btn_re` ×7 (ko `<br>` en) + 주의 문구 `.noti` | **활성 강조 없음**(D17) | `05 §3-2` |
| `ScreenTitle` | `>> 화면명` 평문 `td` + 검색 슬롯 + `button.btn_sch`(`조회 (Search)`) | — | 원§5.8: 중첩 table td → `<button>` 대체 |
| `ScreenNotice` | 안내 영역(배경 `--bg-noti`), 1행 `*`, 이하 `▤` 불릿, 붉은 줄 = `em`(`--maroon`) | 없는 화면(Basket·Huss)은 미렌더 | `05 §3-4` |
| `SearchNone` / `SearchSelect` / `SearchLinkedSelect` / `SearchText` | `.sjt_sch` + 네이티브 `select` / `input[type=text]`(200×32) | LinkedSelect: 하위 3개 **모두 렌더 + display 토글** | `05 §5` |
| `ResultArea` | `div.sch_areaT`(337px, overflow-y auto, 1/1/2px 테두리) | `aria-busy` | `05 §4` |
| `CourseTable` / `EnrollmentTable` | `table.dataT` + `th.first`…`th.last`, `td.first`/`.ltf`/`.timeInfo`/`.last` | 행: 기본 / `.brown`(야간) / `.grey`(마감) | 컬럼 주입(D10) |
| `ThEn` | `span.th-en` (10px, `--blue-en`) — 원 `<font size="1" color="#16529B">` 대체 | — | D2 |
| `CourseTitleCell` | `td.ltf > b(한글명[ span.tag(태그)]) + ' ' + br + 영문명` | 태그 유/무 · 마감 시 부모색 상속 | `01 §3-3` |
| `ActionButton` | `a.btn_blue`(신청) / `a.btn_grey2`(마감, cursor 없음·핸들러 없음) / `a.btn_red`(취소) | 3종 | 폭 90%·padding 3px·11px bold |
| `PrintButtons` | `.btn_regiP`(확인서출력 / Print Confirmation) · `.btn_scheP`(시간표출력 / Print Time table) | — | 클릭 → alert(D23). 색·크기 원문, 비활성 처리 금지 |
| `CaptchaModal` | `.captcha-overlay > .captcha-box`(h1 제목 · `.captcha-body` p · `canvas.captcha-img` · `.captcha-input` label+input · `.captcha-btns` 확인/닫기 · `.captcha-error`) | 오답 에러(파란 굵은 글씨) / 이미지 재생성 | D34, `05 §10` |
| 행 hover | `.dataT tbody tr:hover { background: --row-hover }` | — | D36 |
| `EnrollmentArea` | `div.regi_area > div.regi_top > p.noti_blue(좌) + p(우: 버튼)` + `table.dataT` | — | `05 §6` |
| `LoginBox` | `#login .tit(h1 로고 플레이스홀더 + h2)` `.login_con h3(LOGIN)` `.login_area .id_w p(label+span input)` `.btn_login` `.txt` `ul li a.btn_etc/.btn_etc2` `ul.last` | — | `05 §2` |
| 미사용(정의만 이식) | `.btn_mrc` · `.skip` · `#noti_pop` · `.tit_sub`/`.tit_re_sub`(bul gif 미확보 → 배경 이미지 생략) · `.timeT`/`.leftT`(PRINT_APPLY, Q-5) · `.sch_areaSubT` · `.btn_area` | — | 원§6 전문 유지 |

- 커서: `cursor:pointer` 는 `.btn_re`·`.btn_blue`·`.btn_red`·`.btn_mrc`·`.btn_regiP`·`.btn_scheP`·`.btn_login`·`.btn_etc*` 만. **`.btn_grey2` 는 없음.**
- 링크 색: `a:link/visited/hover/active { text-decoration:none; color:#333 }` — hover 변화 없음.

---

## §4. CSS 이식 원칙 (원§6 → `src/shared/styles/globals.css`)
1. 원§6 CSS 전문을 **규칙 단위로 그대로** 옮긴다(선택자·속성 순서 유지). 모든 hex/명명색 → `var(--토큰)`(§1-2), px 값은 원문 유지(토큰 정의 파일이므로 허용 — token-lint allow).
2. 추가 규칙(하네스): `:root { 토큰 }` · `.th-en { font-size: var(--font-tiny); color: var(--blue-en); }` · `.tag { color: var(--tag-blue); }`(`<font color="blue">` 대체) · 안내 영역 `.scr-noti { background: var(--bg-noti); }` · `.practice-banner`(D11) · `[hidden]{display:none}`. 그 외 신규 클래스 금지 — 필요하면 Tailwind 유틸(토큰 매핑된 것만).
3. `background:url("../images/bul2.gif")` 등 미확보 이미지는 **속성 제거**(padding 유지).
4. 원§6 `#login`·`#noti_pop` 등 id 선택자는 원문 유지(재현 목적 — 아키텍처 규칙의 예외로 D2 에 명시).
5. Tailwind preflight 위에 원§6 리셋을 덧씌운다(`* { margin:0; padding:0; border:0; font-size:100%; vertical-align:baseline }` 등).
6. `.dataT th, .dataT td` 의 `!important` 색(`.btn_* { color: … !important }`)은 원문 유지.
7. **(D40)** `.sch_areaT, .sch_areaSubT`·`.leftT` 에 `box-sizing: content-box` 명시 — 원문이 미지정이라 preflight 의 border-box 를 되돌린다(높이 337px + 테두리 1/1/2px 기준 유지).
8. **(D36)** `#login` 의 `margin:-190px 0 0 -464px; height:380px` → `margin:0; transform:translate(-50%,-50%); height:auto` — 배너(박스 하단) 포함 중앙 보정.
9. **(D36)** 추가 규칙 `.dataT tbody tr:hover { background-color: var(--row-hover) }`.
10. **(D34)** CAPTCHA 모달 클래스 `.captcha-overlay` `.captcha-box` `.captcha-body` `.captcha-img` `.captcha-input` `.captcha-btns` `.captcha-error` 를 하네스 추가 규칙 블록에 둔다(원 jquery-confirm CSS 미확보 → 흰 배경 + 파란 테두리 박스만 재현).

---

## §5. 컴포넌트 실측 (원§7)
| 요소 | 크기 | 비고 |
|---|---|---|
| 상단 헤더 셀 | h 53px | |
| 메뉴 탭 | 50×37 | padding 5px |
| 테이블 헤더 행 | h 38px | padding `5px 3px` |
| 데이터 행 | h 33px | |
| 신청/마감/취소 버튼 | **부모의 90%** × 22px | 고정폭 아님 |
| 확인서출력 / 시간표출력 | 148×24 | |
| 로그인 버튼 | 86×72 | 2행에 걸침 |
| 로그인 입력 필드 | 184×32 | |
| 검색 텍스트 입력 | 200×32 | |
> 실측치는 CSS(padding·font)의 결과값이다. 높이를 강제 지정하지 않고 CSS 이식으로 재현한다(검증은 QA 시 육안/스크린샷).

---

## §6. 아이콘·이미지
- 아이콘 라이브러리 **없음**(원본에 아이콘 없음). `lucide-react` 미설치.
- 이미지: 학교 CI/로고 → 텍스트 플레이스홀더 `[LOGO]`(D12). `bul2.gif`/`bul4.gif` → 생략(Q-10). CAPTCHA 이미지 → 미구현(D3).
- 화살표(`→`, `05 §3-3`) 는 텍스트.

---

## §7. 하네스 기본값 채택 내역 (명세 부재 → `rules/decisions.md`)
| 항목 | 채택 | D |
|---|---|---|
| shadcn/ui·sonner 미도입, 원본 CSS 이식 | §4 | D2 |
| 보충 토큰(원§6/§8.6/§5.5 값) 명명 · Tailwind 별칭 `body`/`line` | §1-2 | D13 |
| 배너 위치/스타일 | `.wrap` 최상단, `.noti em` | D11 |
| 로고 플레이스홀더·앱 명칭 | `[LOGO]` · `수강신청 연습 사이트 (비공식 Mock)` | D12 |
| 탭 활성/행 hover | 미구현 | D17 |
| 웹폰트 | 미도입 | D18 |
| 컬럼 폭 = 설정 데이터 | §1-5 | D10 |
| 뷰포트/테마 | 1400px+ 데스크탑·라이트 전용 | D8 |
| `.timeT th` 상단선 `#3D75BB` → `--blue-topline` 통일 | §1-2 | D13 |
| 웹폰트 Nanum Gothic · 행 hover `--row-hover` · 로그인 중앙 보정 | §1-1·§1-2·§4 | D36(2026-09-06) |
| `.sch_areaT` content-box | §4 | D40 |
| CAPTCHA 토큰·클래스 | §1-2·§4 | D34 |
