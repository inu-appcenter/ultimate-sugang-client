# 05 — 화면 명세 (Screens Spec)

> **출처**: `intake/INU-수강신청-모의사이트-명세.md` 원§2.3(레이아웃)·원§5(마크업 골격)·원§6(CSS)·원§8(텍스트 전문)·원§3(컬럼). **사용자 제공분 재구성** + 명세가 배치를 말하지 않는 지점만 `(init 도출)` 로 표기해 보완(시각 한정, 동작/데이터 창작 없음). Figma 없음 → 이 문서가 시각의 1차 권위(`rules/ui-conventions.md` Figma 정책).
> **관할**: 화면별 시각 명세(레이아웃·필드·모드) + 상호작용 패턴. 값은 전부 `04` 토큰·클래스 명칭으로만 쓴다(raw 값 없음). 동작 권위 = `01`, 계약 = `02`.
> 인용: `05 §4-3`.

---

## §1. 전역 레이아웃 (메인, 원§2.3·원§5.1)

```
<div class="wrap">                            width 80% · min-width 1400px · padding 10px (04 §1-4)
  [PracticeBanner]                            ⚠️ 비공식 연습용 사이트 — 실제 수강신청과 무관합니다   (D11, 최상단 1줄)
  <table class="perT">…</table>               §3-1 상단 학적 정보
  [MenuTabs a.btn_re ×7 ····· 주의 문구]      §3-2 (탭 좌, 주의 문구 우 — init 도출: 같은 줄)
  [제목 라인]  >> 화면명 → [검색조건] [조회 (Search)]    §3-3 (조건 있는 화면은 div.sjt_sch 로 감쌈)
  [ScreenNotice]                              §3-4 (Jungong·Gyoyang·Tagwa·Yungae·Custom 만)
  <div><div class="sch_areaT">                §4 결과 영역 h 337px · overflow-y auto · 테두리 1/1/2px
    <table class="dataT">…</table>
  </div></div>
  <div class="regi_area">                     §6 신청내역
    <div class="regi_top"><p class="noti_blue">수강신청내역 …</p><p>[확인서출력][시간표출력]</p></div>
    <table class="dataT">…</table>
  </div>
</div>
```
- 원본 iframe 구조는 따르지 않는다(D7). 뷰포트 정책 D8(반응형 없음).
- 배너는 `.noti` 스타일(11px bold) + `em`(`--maroon`)으로 1줄, 스크롤 고정 아님(문서 최상단 상시 노출 — init 도출).

---

## §2. `LOGIN` 로그인 (원§6 로그인 CSS·원§8.1)

```
#login  (absolute, 50%/50% 중앙, margin -190px 0 0 -464px, 928×380)
 ├ .tit  (mb 18px)
 │   h1  [LOGO] 텍스트 플레이스홀더 (inline-block, margin 0 34px 0 38px)      ← CI 금지(01 §1), D12
 │   h2  "수강신청 연습 사이트 (비공식 Mock)" (inline-block)                    ← 자체 명칭 D12 / Q-10
 ├ .login_con  (928×306, bg --login-navy, padding 60px 60px 0)
 │   h3 "LOGIN" (mb 34px)
 │   .login_area (position relative, overflow hidden)
 │     div.id_w (float left, padding-right 125px, border-right 1px --login-divide)
 │       p (display table, mb 8px)
 │         label "학번 (ID)"  (table-cell, 110×32, --white bold)
 │         span > input[type=text] (184×32, border none, bg --login-input, padding 0 5px)
 │       p.txt "* 연습용입니다. 아무 값이나 입력하세요." (pt 10px, bold, --login-hint, 11px)
 │       a "학번(ID)/ 비밀번호(PW) 찾기"  (init 도출: .txt 아래 같은 스타일, 동작 없음 — Q-9/D19)
 │     .btn_login (absolute top 0 left 300px, 86×72, pt 27px, 13px bold, border 1px --border-input, bg --btn-bg)
 │        "로그인" <br> "(Login)"
 │     ul (float left, ml 38px) li(w 175px; first mb 10px)
 │        a.btn_etc "수강신청안내" · a.btn_etc "환경설정 및 유의사항"
 │     ul.last (ml 10px) li(w 150px)
 │        a.btn_etc "대학원 수강신청" · a.btn_etc2 "교수-자녀간 수강신청" <br> "[사전신고 안내]"
 └ [PracticeBanner]  박스 하단 (원 footer_notes 3줄 위치를 배너 1줄로 대체, 원§8.1 권장 변경)
```
- **비밀번호 필드 없음**(필수 준수 1). 입력은 학번 1개. `.btn_login` 높이 72px(2행 걸침 실측)는 그대로 유지(init 도출: PW 행 제거로 좌측은 1행이지만 버튼 크기 재현).
- 바로가기 4개·찾기 링크: 렌더만, `href` 없음(D19). `.btn_etc` 3px `--etc-border`, bg `--bg-tab`, h 43px.
- 제출: Enter 또는 버튼. 빈 값 → 진입 안 함·메시지 없음(D19). 성공 → `/sukang`(D14).
- 상태: 단일(로딩/에러 없음 — 서버 호출 없음).

---

## §3. `MAIN_SHELL` 메인 골격

### §3-1. 상단 학적 정보 `table.perT` (원§5.2)
한 행 안에 `th`/`td` 7개 교차. `table-layout: fixed`, width 100%, mb 8px. 셀 padding 10px 15px, 테두리 1px `--border-lt`. `th` 우측정렬·bold·bg `--blue-label`.
```html
<tr>
  <th scope="col" class="titY">2026년도 2학기 수강신청<br>2026 Fall course registration</th>   ← 중앙·--white·14px·bg --navy-900, 영문에 th-en 없음
  <th scope="row">학과(부)<br><span class="th-en">Department</span></th>   <td>{Student.department}</td>
  <th scope="row">학번/성명<br><span class="th-en">ID/Name</span></th>     <td>{학번} / {성명}</td>
  <th scope="row">학년/학적상태<br><span class="th-en">Grade</span></th>   <td>{학년} / {학적상태}</td>
</tr>
```
- 포맷 `01 §3-6`(공백 포함 슬래시). Student 로딩 중: 값 셀 빈 문자열(D9 준용, init 도출). 에러: alert 1회 + 빈 셀.

### §3-2. 메뉴 탭 + 주의 문구 (원§8.3)
- `a.btn_re` ×7, 각 `ko<br>en`: 장바구니/Cart · 전공과목/Major · 교양과목/Liberal Arts · 타학과과목/Other Major · 연계전공과목/Interdisciplinary Courses · HUSS전공과목/HUSS Courses · 과목명(코드) 조회/Search by Course Title(Code).
- 스타일: inline-block, padding 5px, mr 1px, 11px bold, 1px `--border-tab`, bg `--bg-tab`, pointer. **활성 강조 없음**(D17). 클릭 → `?menu=` 전환(`03 §5-8`).
- 주의 문구(`.noti`, 11px bold): `※ 주의(전공) : 검정색→주간학과 수업 / 고동색→야간학과 / 회색→마감강좌` — `span`(`--text-muted`)·`em`(`--maroon`) 은 원문 마크업 없음 → 평문(init 도출). 위치: 탭 줄 우측(init 도출).

### §3-3. 제목 라인 + 검색 영역 (원§5.8·원§8.4·원§8.5)
- 제목: `>> 화면명` 평문 `td`(12px). 텍스트는 `01 §2-3` 표의 "화면 제목" 열 원문(`>> HUSS과목`, `>> 과목명(코드)조회`).
- 조건 있는 화면은 `div.sjt_sch`(overflow hidden, mb 20px, pb 10px, border-bottom 1px `--border-sch`)로 제목+조건+버튼을 감싼다. 조건 없는 화면은 제목만(구분선 없음 — init 도출).
- 배열(원§8.5): `>> 제목` → `→`(텍스트 화살표, init 도출: 화살표 이미지 미확보) → `select`(또는 `input`) [→ `select2`] → `button.btn_sch`.
- `button.btn_sch` "조회 (Search)": inline-block, padding 8px 5px 0, h 32px, bold, bg `--grey-sch`, `--white`. (원본 중첩 table td → `<button>` 대체, 원§5.8 허용)
- select: 네이티브 `<select>`, `font-family Dotum, Gulim; 12px`, `vertical-align middle`. placeholder option = `02 §5-4` 원문(`=` 개수 그대로, value 빈 문자열).
- input[type=text](CUSTOM): 200×32, padding 0 5px, 1px `--border-input`.

### §3-4. 화면별 안내 영역 `ScreenNotice` (원§8.6)
- 배경 `--bg-noti`, 11px(`.noti` 준용, init 도출), 줄 단위. 1행 `* …`, 이하 `▤ …`(불릿은 텍스트 문자 `▤`).
- "붉은색 굵게" 줄(JUNGONG 2행) = `em`(`--maroon`, `.noti em` 매핑 — init 도출). 나머지 줄 `--text`.
- 없는 화면(BASKET·HUSS)은 미렌더 → 제목 바로 다음에 결과 영역.
- 문구 전문은 `01 §4-3~4-8`(원문 띄어쓰기 `가능 합니다` 유지, D5).

### §3-5. 골격 4상태
- 셸 자체는 정적. Student 로딩/에러는 §3-1. 탭 전환 시 결과 영역은 새 화면 컴포넌트로 교체(이전 결과 미유지).

---

## §4. 결과 테이블 공통 (`CourseTable`, 원§5.3~5.7·원§6)

### §4-1. 컨테이너
`div.sch_areaT`: h 337px, overflow-y auto, border 1px 1px 2px `--border`. 로딩 중 `aria-busy="true"`.

### §4-2. 테이블
`table.dataT`: `table-layout fixed`, width 100%, 12px. `aria-label`(원 `summary` 대체) = 화면명. `<colgroup>` 폭 = §4-5.
- `th, td`: padding 5px 3px, center, 1px `--border`. `th`: bold, border-top 2px `--blue-topline`, bg `--blue-header`.
- 첫 컬럼 `class="first"`(border-left none), 액션 컬럼 `class="last"`(border-right none).

### §4-3. 헤더 셀
```html
<th scope="col" class="first">학년<br><span class="th-en">Grade</span></th>
<th scope="col">이수구분<br><span class="th-en">Course Type</span></th> …
<th scope="col">요일 및 교시(강의실)</th>          ← en 없음(D21)
… <th scope="col" class="last">신청</th>           ← 액션 헤더 ko 만(D21)
```
`span.th-en`: 10px(`--font-tiny`), `--blue-en`.

### §4-4. 데이터 행
```html
<tr class="{'' | 'brown' | 'grey'}">
  <td class="first">전학년</td>
  <td>전공심화</td>
  <td>0006154050</td>
  <td class="ltf"><b>현장교육.실습(Ⅴ-1)</b> <br>(INTERNSHIP(Ⅴ-1))</td>                       ← §4-6
  <td>12</td>
  <td></td>                                          ← 원어여부 빈 셀
  <td class="timeInfo">월 1 2 3 … (ZZ-102)</td>       ← left·pl 10px·nowrap·ellipsis. schedule[] 을 공백 1칸으로 join
  <td>컴퓨터공학부</td>
  <td>최승식</td>
  <td class="last"><a class="btn_blue">신청</a></td>  ← §4-7
</tr>
```
- 행 색: `isNight` → `brown`(`--maroon`), `isClosed` → `grey`(`--text-muted`, 자식 태그도 상속). 둘 다면 `grey` 우선(init 도출: 마감 표시가 신청 가능성 판단에 우선). `blue` 클래스는 사용하지 않음(`01 §3-5`).
- `.ltf`: left, padding 0 0 0 10px.

### §4-5. 컬럼 폭 (원§3, D10 — `columns.ts` 설정값)
기준(전공과목, 합 1378): 학년 50 · 이수구분 70 · 학수번호 80 · **교과목명 543** · 학점 50 · 원어여부 65 · 요일및교시 250 · 개설학과 125 · 교강사 80 · 신청 65.
- 규칙(init 도출): 동일 컬럼은 화면이 달라도 같은 폭. **교과목명 = 1378 − 나머지 합**(전공과목에서 543 이 정확히 재현됨). 명세 밖 컬럼: 이수영역 125(개설학과와 동일 폭 부여) · 순번 50 · 재수강 구분 80 · 취소 65.
- 적용: `<colgroup>` 의 `<col>` 별 `style={{ width }}`(px). 컨테이너가 넓으면 fixed 레이아웃이 비례 확대.

### §4-6. 교과목명 셀 `CourseTitleCell` (원§5.5)
```html
<td class="ltf"><b>현장교육.실습(Ⅴ-1)</b> <br>(INTERNSHIP(Ⅴ-1))</td>                                  기본
<td class="ltf"><b>대학수학(2)<span class="tag"> [75분수업]</span></b> <br>(CALCULUS(2))</td>           태그 포함
```
- 한글명 `<b>`; 태그는 `<b>` **내부**에 `span.tag`(`--tag-blue`)로, 앞 공백 1칸; `</b>` 뒤 공백 1칸 → `<br>` → 영문명(괄호 포함, `nameEn` 원문). 태그 여러 개면 각 앞에 공백 1칸(init 도출).
- 마감 행에서는 부모 `grey` 색이 태그에도 상속되도록 `span.tag` 색을 `tr.grey` 하위에서 무효화(`.dataT .grey .tag { color: inherit }` — init 도출, 원§5.5 "태그도 회색으로 보인다" 재현).

### §4-7. 액션 셀 `ActionButton` (원§5.6)
| 상태 | 마크업 | 스타일 | 동작 |
|---|---|---|---|
| 신청 가능 | `<td class="last"><a class="btn_blue">신청</a></td>` | 폭 90%, padding 3px, 11px bold, 1px `--blue-border`, bg `--bg-btn`, `--blue-text`, pointer | 클릭 → 신청 플로우(`01 §6-1`) |
| 마감 | `<td class="last"><a class="btn_grey2">마감</a></td>` | 1px/글자 `--text-muted`, bg `--bg-btn`, **cursor 없음** | **핸들러 없음**(클릭 불가) |
| 신청내역 | `<td class="last"><a class="btn_red">취소</a></td>` | 1px `--red-border`, `--red-text`, pointer | 클릭 → 취소 플로우(`01 §6-2`) |
- `href`·`onclick` 없음(원문). React 에서는 `btn_blue`/`btn_red` 에만 `onClick`, `role="button"`·`tabIndex=0`(init 도출, 접근성). `btn_grey2` 는 이벤트 없음.
- 진행 중 재클릭 무시(시각 변화 없음, D9).

### §4-8. 4상태 (D9)
| 상태 | 렌더 |
|---|---|
| Loading | thead 만, tbody 비움, `aria-busy` |
| Error | thead 만 + `alert(메시지)` 1회 |
| Empty | thead 만, **안내 문구 없음** |
| Data | 행 전건(스크롤) |

---

## §5. 탭 화면 7종 (제목·검색 UI·안내·컬럼)

| SCREEN_ID | 제목 라인 | 검색 UI | 안내 | 컬럼(순서) |
|---|---|---|---|---|
| `BASKET` | `>> 장바구니` | 없음(즉시 로드) | 없음 | 학년·이수구분·학수번호·교과목명·학점·원어여부·요일및교시·개설학과·교강사·신청 (10) |
| `JUNGONG` | `>> 전공과목` | 없음(즉시 로드) | 3줄(`01 §4-3`, 2행 em) | 위와 동일 (10) |
| `GYOYANG` | `>> 교양과목` → `[===== 이수구분 =====▼]` → `[===== 이수영역 =====▼]` `[조회 (Search)]` | 2단 연동(§5-1) | 5줄(`01 §4-4`) | 이수구분·이수영역·학수번호·교과목명·학점·원어여부·요일및교시·교강사·신청 (9) |
| `TAGWA` | `>> 타학과과목` → `[========== 학과(부) ==========▼]` `[조회 (Search)]` | 단일 select 76 | 2줄(`01 §4-5`) | 학년·이수구분·학수번호·교과목명·학점·원어여부·요일및교시·교강사·신청 (9) |
| `YUNGAE` | `>> 연계전공과목` → `[========== 연계전공 ==========▼]` `[조회 (Search)]` | 단일 select 32 | 2줄(`01 §4-6`) | 학년·학수번호·교과목명·학점·원어여부·요일및교시·교강사·신청 (8) |
| `HUSS` | `>> HUSS과목` | 없음(즉시 로드) | 없음 | 학년·학수번호·교과목명·학점·원어여부·요일및교시·개설학과·교강사·신청 (9) |
| `CUSTOM` | `>> 과목명(코드)조회` → `[텍스트 200×32]` `[조회 (Search)]` | 텍스트 2자 이상 | 2줄(`01 §4-8`) | 학년·이수구분·학수번호·교과목명·학점·원어여부·요일및교시·개설학과·교강사·신청 (10) |

### §5-1. `GYOYANG` 2단 연동 select (원§4.1)
- `select#cmbCptnGbn`: placeholder + 6 option(`11 기초교양` … `80 일반선택`, 표시는 이름만).
- `select#cmbFldGnb11`·`#cmbFldGnb21`·`#cmbFldGnb23` **3개를 모두 DOM 에 렌더**하고 1단 값에 따라 하나만 표시(`hidden`/`display:none` 토글), 50/70/80/미선택이면 전부 숨김. 1단 변경 시 하위 선택값 초기화(init 도출).
- 조회 조건: `{ cptnGbn, fldGnb? }`. 미선택 시 no-op(D19).

### §5-2. `TAGWA`·`YUNGAE` 단일 select
- option 텍스트 = `02 §5-2`/`§5-3` 원문 순서. value = 코드(미제공 → mock 은 이름, Q-14). placeholder 선택 상태 조회 → no-op(D19).

### §5-3. `CUSTOM` 텍스트
- `input[type=text]` 200×32. Enter 또는 [조회]. 2자 미만 → no-op(D19). 검색은 과목명 또는 학수번호(서버 판단, `02 §3` O-8).

### §5-4. 조건 없음 화면(`BASKET`·`JUNGONG`·`HUSS`)
- 탭 진입 즉시 로드. 제목 라인만(검색 영역·구분선 없음).

---

## §6. `ENROLLMENT_LIST` 수강신청내역 (원§2.3·원§8.7·원§3)

```
div.regi_area
 ├ div.regi_top (mb 5px, clearfix)
 │   p.noti_blue (float left, pt 5px, 11px, --noti-blue)
 │     "수강신청내역 List of Courses registrered ( * 삭제시 삭제할 과목의 취소버튼을 클릭하세요. )"   ← 오탈자 원문(D5)
 │   p (float right)
 │     a.btn_regiP "확인서출력<br>Print Confirmation"   (padding 5px, 11px bold, bg --blue-print, --white, 148×24 실측)
 │     a.btn_scheP "시간표출력<br>Print Time table"     (bg --orange, --white)
 └ table.dataT (§4 공통, colgroup 11)
```
- 컬럼(11, 순서): 순번 No · 이수구분 Course Type(**`Enrollment.resolvedType`**) · 학수번호 Course No · 교과목명 Course Title · 학점 Credit · 원어여부 EN · 요일 및 교시(강의실) · 개설학과 Dpt · 재수강 구분 Re-Att.Class · 교강사 Prof · 취소(`btn_red`).
- 순번 1부터(`createdAt` 오름차순 — init 도출: 신청 순). 재수강 구분 신규 = 빈 셀. 행 색 규칙 §4-4 동일.
- 결과 컨테이너: 명세 레이아웃은 `sch_areaT` 없이 `table.dataT` 직접(스크롤 없음 — 전건). 그대로 재현.
- 헤더 문구 위치 = `p.noti_blue`(init 도출: 원§6 `.regi_top p.noti_blue { float:left }` 매핑). 출력 버튼 = 우측 `p`.
- 4상태: §4-8 동일(Loading/Empty = thead 만).
- 취소: `01 §6-2`. 성공 후 목록 재조회로 행 제거·순번 재부여.
- 출력 버튼: 렌더만(Q-5) — 클릭 무동작, pointer 는 원문대로 유지.

---

## §7. 상호작용 패턴 (전 화면 공통)
| 패턴 | 규격 |
|---|---|
| 알림 | `window.alert` — 메시지 `02 §4-3`, 포맷 `01 §6-5`. 커스텀 모달 금지(D2) |
| 확인 | `window.confirm` — 취소 플로우만 |
| 토스트 | 없음 |
| 모달 | 없음(CAPTCHA 미구현 D3, 공지 팝업 미구현) |
| 버튼 상태 | disabled 시각 없음(원본 CSS 무). 로딩 중 로직 가드만(D9) |
| hover | 링크/버튼 hover 시각 변화 없음(`a:hover` 색 동일). 행 hover 하이라이트 미구현(D17) |
| 포커스 | 브라우저 기본 outline 유지(원본 CSS 가 outline 을 제거하지 않음) |
| 키보드 | 폼은 Enter 제출. 액션 `a` 는 Enter/Space 로 클릭 동등(init 도출) |
| 스크롤 | 결과 영역만 내부 스크롤(337px). 페이지 가로 스크롤은 `min-width 1400px` 이하 뷰포트에서 발생(원본 동일) |

---

## §8. 명세 gap 화면 (답변 전 구현 금지)
| SCREEN_ID | 확보된 것 | 미확보(🙋🏻) |
|---|---|---|
| `PRINT_CHECK` 확인서출력 | 버튼 텍스트·스타일(§6) | 화면 내용·레이아웃·데이터·출력 방식(새 창/인쇄) — **Q-5** |
| `PRINT_APPLY` 시간표출력 | 버튼 + CSS `.leftT`(float left, 100%, h 320px, 스크롤, 테두리 1/1/2px `--border`)·`.timeT`(fixed, 12px; `.rightT` float right 28%; th bg `--time-th`, 상단선; `.sun` `--time-sun`, `.sat` `--time-sat`, `.blue2` `--cyan`, `.grey2` `--border`; 셀 padding 0, h 1px, center) | 그리드 구성(요일/교시 축·셀 내용·rightT 내용) — **Q-5** |
| `WAITING_ROOM` 대기열 | 원§12 "오픈 직후 N초 대기 화면" | 문구·레이아웃·진입/이탈 트리거·서버 신호 — **Q-6** |

---

## §9. init 도출·보완 항목 (시각 한정 — 리뷰 패킷 §C 표기용)
1. 배너 위치·스타일(D11) / 로고 플레이스홀더·명칭(D12).
2. 탭 줄과 주의 문구를 같은 줄에 좌/우 배치(§3-2).
3. 조건 없는 화면의 제목 라인에 `.sjt_sch` 구분선 없음(§3-3).
4. 화살표 `→` 텍스트(§3-3) · `▤` 텍스트 불릿(§3-4).
5. 안내 영역 글자 크기 11px·붉은 줄 = `em` maroon(§3-4).
6. Student 로딩 중 빈 셀(§3-1).
7. 명세 밖 컬럼 폭(이수영역 125·순번 50·재수강 80·취소 65) + 교과목명 잔여폭 규칙(§4-5).
8. `grey` 가 `brown` 보다 우선(§4-4) · 태그 색 상속 무효화(§4-6) · 복수 태그 공백(§4-6).
9. 액션 `a` 의 role/tabIndex·키보드 동등(§4-7·§7).
10. 신청내역 헤더 문구 = `p.noti_blue`, 순번 = 신청 순(§6).
11. 2단 select 1단 변경 시 하위 초기화(§5-1).
12. 찾기 링크 위치(§2).
