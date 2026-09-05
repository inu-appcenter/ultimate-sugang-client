# INU 수강신청 모의 사이트 구현 명세

> 원본: `sugang.inu.ac.kr` (2026년도 2학기)
> 조사일: 2026-09-04
> 목적: 수강신청 연습용 모의 사이트 제작. 서버·API는 별도 존재.

---

## 0. 제작 원칙

이 프로젝트는 **UI/UX 재현 + 자체 백엔드** 구조다. 원본 서버에는 접근하지 않는다.

| 재현 대상 | 재현하지 않을 것 |
|---|---|
| DOM 구조, 레이아웃, 클릭 타겟 좌표·크기 | 실제 API 엔드포인트 |
| CSS (색상·폰트·간격·버튼 상태) | 인증/세션 로직 |
| 화면 전환 순서, 안내 문구, 에러 메시지 | 매크로 탐지(`macroChk`) 로직 |
| 검증 규칙의 **동작** | NetFunnel 대기열 연동 |

### 필수 준수 사항

1. **비밀번호 필드를 만들지 않는다.** `input[type="password"]`를 두면 피싱으로 오인될 수 있다. 학번만 입력받거나 "아무 값이나 입력" 안내로 대체한다.
2. **학교 CI/로고는 플레이스홀더로 교체한다.**
3. **연습용 배너를 고정 노출한다.** 예: `⚠️ 비공식 연습용 사이트 — 실제 수강신청과 무관합니다`
4. **공개 배포 시 URL에 `mock`/`practice`를 명시한다.**

---

## 1. 아키텍처

```
/                                  ← 껍데기 셸
└── <iframe id="sukang">
    └── /jsp/SukangInit.jsp        ← 실제 앱
```

| 항목 | 값 |
|---|---|
| 스택 | JSP + jQuery 3.7.1 |
| 그리드 | 순수 `<table>` (Nexacro/WebSquare/RealGrid/AUIGrid **미사용**) |
| Canvas 렌더링 | 없음 |
| 페이징 | **없음** — 전건 렌더링 + `overflow-y: auto` |
| 대기열 | NetFunnel (`nfStart`/`nfStop`) |
| 매크로 방지 | `macroChk` + 상시 CAPTCHA |
| 모달 라이브러리 | jquery-confirm (CAPTCHA용) |
| 브라우저 제약 | Chrome / Edge 전용, Safari 미지원 |

> 모의 사이트에서 iframe 구조를 따라할 필요는 없다. 단일 페이지로 만들어도 시각적 결과는 동일하다.

### 전역 함수 (동작 참고용)

```
onSukangMenu(key)   화면 전환
onResultList()      결과 목록 렌더링
onSukangUpdate()    신청/취소
listColorOn/Off()   행 하이라이트
goPrint(type)       출력
```

---

## 2. 화면 구성

### 2.1 화면 목록

| 키 | 화면명 | 검색 조건 | 결과 컬럼 수 |
|---|---|---|---|
| `Basket` | 장바구니 | 없음 (즉시 로드) | 10 |
| `Jungong` | 전공과목 | 없음 (즉시 로드) | 10 |
| `Gyoyang` | 교양과목 | 2단 연동 select | 9 |
| `Tagwa` | 타학과과목 | select (76개) | 9 |
| `Yungae` | 연계전공과목 | select (32개) | 8 |
| `Huss` | HUSS전공과목 | 없음 (즉시 로드) | 9 |
| `Custom` | 과목명(코드) 조회 | 텍스트 (2자 이상) | 10 |

출력 기능 2종: `goPrint('check')` 확인서출력 / `goPrint('apply')` 시간표출력

### 2.2 검색 조건 패턴 3종

모의 사이트는 이 3개 컴포넌트만 만들면 7개 화면을 전부 커버한다.

1. **조건 없음** — Basket, Jungong, Huss
2. **단일 select + 조회** — Tagwa, Yungae
3. **연동 select 또는 텍스트 + 조회** — Gyoyang, Custom

### 2.3 화면 레이아웃

```
┌─ table.perT ────────────────────────────────────┐
│ [학기 titY] [학과(부)] [값] [학번/성명] [값] ... │
└─────────────────────────────────────────────────┘
┌─ 메뉴 탭 7개 (a.btn_re) ─── 주의 문구 ──────────┐
└─────────────────────────────────────────────────┘
  >> 화면명  →  [검색조건]  [조회 (Search)]
┌─ div.sch_areaT (height 337px, overflow-y auto) ─┐
│   table.dataT  ← 조회 결과                       │
└─────────────────────────────────────────────────┘
  수강신청내역 ...              [확인서출력][시간표출력]
┌─ 신청내역 table.dataT ──────────────────────────┐
└─────────────────────────────────────────────────┘
```

---

## 3. 컬럼 매트릭스

| 컬럼 | 전공 | 교양 | 타학과 | 연계 | HUSS | 장바구니 | 과목명조회 | 신청내역 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 순번 No | | | | | | | | ● |
| 학년 Grade | ● | | ● | ● | ● | ● | ● | |
| 이수구분 Course Type | ● | ● | ● | | | ● | ● | ● |
| 이수영역 Course Area | | ● | | | | | | |
| 학수번호 Course No | ● | ● | ● | ● | ● | ● | ● | ● |
| 교과목명 Course Title | ● | ● | ● | ● | ● | ● | ● | ● |
| 학점 Credit | ● | ● | ● | ● | ● | ● | ● | ● |
| 원어여부 EN | ● | ● | ● | ● | ● | ● | ● | ● |
| 요일 및 교시(강의실) | ● | ● | ● | ● | ● | ● | ● | ● |
| 개설학과 Dpt | ● | | | | ● | ● | ● | ● |
| 재수강 구분 Re-Att.Class | | | | | | | | ● |
| 교강사 Prof | ● | ● | ● | ● | ● | ● | ● | ● |
| 액션 | 신청 | 신청 | 신청 | 신청 | 신청 | 신청 | 신청 | **취소** |
| **합계** | **10** | **9** | **9** | **8** | **9** | **10** | **10** | **11** |

### 생략 규칙

**검색 조건으로 이미 확정된 정보는 결과 컬럼에서 제거된다.**

- 교양: 개설학과 제거 ↔ 이수영역 추가
- 타학과: 학과를 골랐으므로 개설학과 제거
- 연계전공: 개설학과 + 이수구분 둘 다 제거 (최소 8컬럼)
- HUSS: 전부 HUSS전공이므로 이수구분 제거
- 과목명조회: 확정되는 게 없으므로 **전체 10컬럼 = 최대 집합**

### 구현 권장

컬럼 정의를 화면별 설정값으로 주입한다. 하드코딩하면 화면마다 다시 짜야 한다.

```jsx
<CourseTable columns={SCREEN_COLUMNS[screenKey]} rows={data} />
```

### 컬럼 폭 (전체 1378px, 전공과목 기준)

```
학년   이수구분  학수번호  교과목명  학점  원어여부  요일및교시  개설학과  교강사  신청
 50      70       80      543     50     65       250      125     80     65
```

교과목명이 전체의 39%. 나머지는 고정폭. `table-layout: fixed`.

---

## 4. 코드 체계

### 4.1 교양과목 2단 트리

**3단계 이상은 존재하지 않는다.** (검증 완료)

```yaml
cmbCptnGbn:                    # 이수구분
  11: { name: 기초교양, child: cmbFldGnb11 }
  21: { name: 핵심교양, child: cmbFldGnb21 }
  23: { name: 심화교양, child: cmbFldGnb23 }
  50: { name: 교직,     child: null }
  70: { name: 군사학,   child: null }
  80: { name: 일반선택, child: null }

cmbFldGnb11:                   # 기초교양 → 이수영역
  161: 학문의기초
  162: 기초과학ㆍ공학           # ㆍ = U+318D (일반 · U+00B7 아님)

cmbFldGnb21:                   # 핵심교양 → 이수영역
  171: (핵심)INU세미나
  172: (핵심)인문
  173: (핵심)사회
  174: (핵심)과학기술
  175: (핵심)예술체육
  176: (핵심)외국어

cmbFldGnb23:                   # 심화교양 → 이수영역
  182: 인문
  183: 사회
  184: 과학기술
  185: 예술체육
  186: 외국어
```

**구현 방식**: 하위 select를 동적 생성하지 않는다. **3개를 모두 DOM에 렌더링해두고 `display` 토글**한다. 상위 코드값이 곧 하위 select의 id 접미사(`cmbFldGnb` + `11`/`21`/`23`).

### 4.2 타학과 학과(부) — 76개 (`cmbTagwaCd`)

```
Global Trade & Service학부, HUSS(교류대학), HUSS(타대학),
HUSS포용사회이니셔티브학부, IBE전공, 건설환경공학전공, 건축공학전공,
경영학부, 경제학과, 경제학과(야), 공연예술학과, 국어교육과, 국어국문학과,
기계공학과, 나노바이오공학전공, 데이터과학과, 도시건축학부, 도시건축학전공,
도시공학과, 도시행정학과, 도시환경공학부, 독어독문학과, 동북아국제통상전공,
디자인학부, 무역학부(야), 문헌정보학과, 물리학과, 미디어커뮤니케이션학과,
바이오-로봇시스템공학과, 반도체융합전공, 법학부, 분자의생명전공,
불어불문학과, 사회복지학과, 산업경영공학과, 생명공학부, 생명공학전공,
생명과학부, 생명과학전공, 서양화전공, 세무회계학과, 소비자학과, 수학과,
수학교육과, 스마트물류공학전공, 스포츠과학부, 신소재공학과, 안전공학과,
에너지화학공학과, 역사교육과, 영어교육과, 영어영문학과, 운동건강학부,
유아교육과, 윤리교육과, 일본지역문화학과, 일어교육과, 임베디드시스템공학과,
자유전공학부, 전기공학과, 전자공학과, 전자공학부, 전자공학전공,
정보통신공학과, 정치외교학과, 조형예술학부, 중어중국학과, 창의인재개발학과,
체육교육과, 컴퓨터공학부, 패션산업학과, 한국화전공, 해양학과, 행정학과,
화학과, 환경공학전공
```

패턴: 야간 학과는 `(야)` 접미사 / 학부·전공·학과 혼재 (평면 리스트) / 정렬은 **영문 → 한글 가나다순**

### 4.3 연계전공 — 32개 (`cmbYungaeCd`)

```
INU리버럴아츠연계전공, MICE,스포츠및관광연계전공, 공연예술과시각예술연계전공,
공중보건연계전공, 광전자공학전공(연계), 국제개발협력연계전공,
국제비즈니스및세무연계전공, 글로벌기업가정신연계전공, 기후,에너지및환경연계전공,
녹색기후연계전공, 녹색도시연계전공, 동북아지역학전공(연계), 물류학전공(연계),
미래교육디자인연계전공, 미래도시연계전공, 미래자동차연계전공,
바이오융합·창업연계전공, 뷰티산업연계전공, 소셜데이터사이언스연계전공,
신재생에너지연계전공, 유럽통상학전공(연계), 유전체학연계전공,
인공지능·창업연계전공, 인공지능소프트웨어연계전공, 인문문화예술기획연계전공,
줄기세포및조직공학연계전공, 중국연구연계전공, 중국지역학전공(연계),
지능로봇연계전공, 지능형로봇시스템연계전공, 창의적디자인연계전공, 항체공학연계전공
```

네이밍 2종: `~연계전공` (다수) / `~전공(연계)` (6개)

### 4.4 select placeholder 원문

```
cmbCptnGbn:  "===== 이수구분 ====="
cmbFldGnb*:  "===== 이수영역 ====="
cmbTagwaCd:  "========== 학과(부) =========="
cmbYungaeCd: "========== 연계전공 =========="
```

`=` 개수가 select마다 다르다. 폭에 맞춘 것이므로 그대로 써야 시각적으로 같다.

---

## 5. 마크업 골격

### 5.1 전체 구조

```html
<div class="wrap">                      <!-- width:80%; min-width:1400px -->
  <table class="perT">…</table>          <!-- 상단 학적 정보 -->
  <!-- 메뉴 탭 a.btn_re × 7 -->
  <div class="sjt_sch">…</div>           <!-- 검색 영역 (조건 있는 화면만) -->
  <div><div class="sch_areaT">
    <table summary="…" class="dataT">…</table>
  </div></div>
  <div class="regi_area">…</div>         <!-- 신청내역 -->
</div>
```

### 5.2 상단 학적 정보 (`table.perT`)

한 행(`<tr>`) 안에 `th`/`td`가 7개 교차한다.

```html
<tr>
  <th scope="col" class="titY">2026년도 2학기 수강신청<br>
      2026 Fall course registration</th>
  <th scope="row">학과(부)<br>
      <font size="1" color="#16529B">Department</font></th>
  <td>컴퓨터공학부</td>
  <th scope="row">학번/성명<br>
      <font size="1" color="#16529B">ID/Name</font></th>
  <td>2022XXXXX / 홍○○</td>
  <th scope="row">학년/학적상태<br>
      <font size="1" color="#16529B">Grade</font></th>
  <td>4 / 유예</td>
</tr>
```

- `.titY`만 `scope="col"`, 나머지 라벨은 `scope="row"`
- `.titY`는 영문에 `<font>` 없이 흰 글씨 (배경이 남색)
- 데이터 포맷: `{학번} / {성명}`, `{학년} / {학적상태}` — **공백 포함 슬래시**

### 5.3 데이터 테이블 헤더

```html
<tr>
  <th scope="col" class="first">학년<br>
      <font size="1" color="#16529B">Grade</font></th>
  <th scope="col">이수구분<br>
      <font size="1" color="#16529B">Course Type</font></th>
  …
</tr>
```

영문 라벨: `#16529B`, `<font size="1">` ≈ 10px, `<br>` 구분, 첫 컬럼 `class="first"`

> `<font>`는 HTML 4 유물이고 `size="1"`은 브라우저 의존적이다. `<span class="th-en">` + CSS로 대체하되 렌더링 결과(10px, `#16529B`)를 맞춘다.

### 5.4 데이터 행

```html
<tr>
  <td class="first">전학년</td>
  <td>전공심화</td>
  <td>0006154050</td>
  <td class="ltf"><b>현장교육.실습(Ⅴ-1)</b> <br>(INTERNSHIP(Ⅴ-1))</td>
  <td>12</td>
  <td></td>                                    <!-- 원어여부: 빈 셀 -->
  <td class="timeInfo">월 1 2 3 … (ZZ-102)</td>
  <td>컴퓨터공학부</td>
  <td>최승식</td>
  <td class="last"><a class="btn_blue">신청</a></td>
</tr>
```

### 5.5 교과목명 셀 — 2가지 변형

```html
<!-- 기본 -->
<td class="ltf"><b>현장교육.실습(Ⅴ-1)</b> <br>(INTERNSHIP(Ⅴ-1))</td>

<!-- 태그 포함 (태그가 <b> 안에 중첩) -->
<td class="ltf"><b>대학수학(2)<font color="blue"> [75분수업]</font></b> <br>(CALCULUS(2))</td>
```

**구조 규칙**
- 한글명은 항상 `<b>`
- 태그는 **`<b>` 내부에 `<font color="blue">`** 로 중첩, 앞에 공백 1칸
- `<b>` 닫은 뒤 **공백 1칸** → `<br>` → 영문명 (괄호 포함, `<b>` 밖)
- 태그 종류: `[75분수업]`, `[온라인혼합형강좌]`, `[e-Learning]`
- 마감 행에서는 부모 색(`#848484`)이 상속되어 태그도 회색으로 보인다

### 5.6 액션 셀

```html
<td class="last"><a class="btn_blue">신청</a></td>     <!-- 신청 가능 -->
<td class="last"><a class="btn_grey2">마감</a></td>    <!-- 마감 -->
<td class="last"><a class="btn_red">취소</a></td>      <!-- 신청내역 -->
```

**`href`도 `onclick`도 없다.** jQuery가 클래스 기준으로 이벤트를 위임한다. 그래서 `마감`은 비활성 처리가 아니라 **애초에 핸들러 대상이 아니어서** 클릭되지 않는다.

### 5.7 셀 클래스

| 클래스 | 위치 | 역할 |
|---|---|---|
| `first` | 첫 컬럼 | 좌측 테두리 제거 |
| `ltf` | 교과목명 | `text-align:left`, `padding-left:10px` |
| `timeInfo` | 요일및교시 | `text-align:left` + 말줄임 |
| `last` | 액션 컬럼 | 우측 테두리 제거 |
| `grey` | 행 텍스트 | 마감강좌 `#848484` |
| `brown` | 행 텍스트 | 야간학과 `maroon` |
| `blue` | 행 텍스트 | `#0082A7` (용도 미확인) |

### 5.8 조회 버튼

`<button>`이나 `<a>`가 아니라 **`onclick`이 걸린 중첩 `<table>` 안의 `<td>`** 다.

```html
<tr>
  <td>…</td> × 4                    <!-- 라벨/화살표 -->
  <td><select></td>                 <!-- 검색 조건 -->
  <td>…</td>
  <td><table><tr><td onclick="…">조회 (Search)</td></tr></table></td>
</tr>
```

모의 사이트에서는 일반 `<button>`으로 대체한다. 시각적 결과만 맞추면 된다.

---

## 6. CSS 전문

원본 `style.css` 100개 규칙 중 재현에 필요한 전체.

```css
/* ===== 리셋 / 기본 ===== */
* { margin:0; padding:0; border:0; font-size:100%; vertical-align:baseline; }
body { color:#333; font-size:12px;
       font-family: Dotum, Gulim, 돋움, 굴림, arial, sans-serif; }
table { border-collapse:collapse; border-spacing:0; }
em { font-style:normal; }
hr { display:none; }
ol, ul { list-style:none; }
img, select, textarea { vertical-align:middle; }
input[type="text"], select, textarea { font-family:Dotum, Gulim; font-size:12px; }
a:link, a:visited, a:hover, a:active { text-decoration:none; color:#333; }

/* ===== 레이아웃 ===== */
.wrap { box-sizing:border-box; padding:10px; width:80%; min-width:1400px; }

/* ===== 상단 학적 정보 ===== */
.perT { table-layout:fixed; width:100%; margin-bottom:8px; }
.perT th, .perT td { box-sizing:border-box; padding:10px 15px;
                     border:1px solid #CCCBC9; }
.perT th { text-align:right; font-weight:bold; background-color:#D6DFF0; }
.perT th.titY { text-align:center; vertical-align:middle; color:#fff;
                font-size:14px; background-color:#0F4EAB; }

/* ===== 검색 영역 ===== */
.sjt_sch { overflow:hidden; box-sizing:border-box; width:100%;
           margin-bottom:20px; padding-bottom:10px;
           border-bottom:1px solid #CBCBCB; }
.sjt_sch label, #register .sjt_sch span { float:left; }
.sjt_sch label { display:inline-block; font-weight:bold; padding:8px 10px 0 0; }
.sjt_sch span input[type="text"] { box-sizing:border-box; padding:0 5px;
           width:200px; height:32px; vertical-align:middle;
           border:1px solid #CFCFCF; }

/* ===== 결과 스크롤 컨테이너 ===== */
.sch_areaT,
.sch_areaSubT { height:337px; overflow-y:auto;
                border-width:1px 1px 2px; border-style:solid;
                border-color:#B7B7B7; }

/* ===== 데이터 테이블 ===== */
.dataT { table-layout:fixed; width:100%; font-size:12px; }
.dataT th, .dataT td { box-sizing:border-box; padding:5px 3px;
                       text-align:center; border:1px solid #B7B7B7; }
.dataT th { font-weight:bold; border-top:2px solid #3E74BA;
            background-color:#E0E8F5; }
.dataT .first { border-left:none; }
.dataT .last  { border-right:none; }
.dataT .ltf   { text-align:left; padding:0 0 0 10px; }
.dataT .timeInfo { text-align:left; padding:0 0 0 10px;
                   white-space:nowrap; overflow:hidden;
                   text-overflow:ellipsis; }
.dataT .grey  { color:#848484; }
.dataT .brown { color:maroon; }
.dataT .blue  { color:#0082A7; }

/* ===== 신청내역 영역 ===== */
.regi_area .regi_top { margin-bottom:5px; }
.regi_area > div::after { content:""; display:block; clear:both; }
.regi_area .regi_top p { float:right; }
.regi_area .regi_top p.noti_blue { float:left; padding-top:5px; }

/* ===== 버튼 ===== */
.btn_re    { display:inline-block; box-sizing:border-box; padding:5px;
             margin-right:1px; font-weight:bold; font-size:11px;
             border:1px solid #CDCDCD; background-color:#F3F3F3;
             cursor:pointer; }
.btn_sch   { display:inline-block; box-sizing:border-box;
             padding:8px 5px 0; height:32px; vertical-align:middle;
             font-weight:bold; background-color:#616161;
             color:#fff !important; }
.btn_blue  { width:90%; display:inline-block; box-sizing:border-box;
             padding:3px; font-weight:bold; font-size:11px;
             border:1px solid #1F5CB7; background-color:#F2F2F2;
             cursor:pointer; color:#004096 !important; }
.btn_grey2 { width:90%; display:inline-block; box-sizing:border-box;
             padding:3px; font-weight:bold; font-size:11px;
             border:1px solid #848484; background-color:#F2F2F2;
             color:#848484 !important; }              /* cursor 없음 */
.btn_red   { width:90%; display:inline-block; box-sizing:border-box;
             padding:3px; font-weight:bold; font-size:11px;
             border:1px solid #C80606; background-color:#F2F2F2;
             cursor:pointer; color:#CA0000 !important; }
.btn_mrc   { display:inline-block; box-sizing:border-box; padding:3px;
             font-weight:bold; font-size:11px;
             border:1px solid #1F5CB7; background-color:#F2F2F2;
             cursor:pointer; color:#004096 !important; }
.btn_regiP { display:inline-block; box-sizing:border-box; padding:5px;
             text-align:center; font-weight:bold; font-size:11px;
             background-color:#306FB6; cursor:pointer;
             color:#fff !important; }
.btn_scheP { display:inline-block; box-sizing:border-box; padding:5px;
             font-weight:bold; font-size:11px;
             background-color:#D95C00; cursor:pointer;
             color:#fff !important; }
.btn_area  { margin-bottom:10px; }

/* ===== 안내 문구 ===== */
.noti      { font-size:11px; font-weight:bold; }
.noti span { color:#848484; }
.noti em   { color:maroon; }
.noti_blue { font-size:11px; color:#1958A8; }
.tit_sub    { margin:30px 0 15px; padding-left:35px; font-size:14px;
              background:url("../images/bul2.gif") 0 center no-repeat; }
.tit_re_sub { margin:20px 0 10px; padding-left:30px; font-size:14px;
              background:url("../images/bul4.gif") 0 center no-repeat; }

/* ===== 접근성 스킵 링크 ===== */
.skip { display:block; height:1px; width:1px; margin:0 -1px -1px 0;
        padding:0; overflow:hidden; font-size:0; line-height:0; }
.skip:hover, .skip:active, .skip:focus {
        width:100%; height:auto; margin:0; padding:5px 0;
        text-indent:10px; font-weight:bold; font-size:12px;
        color:#333; font-family:Dotum; line-height:1;
        text-align:center; text-decoration:none !important; }

/* ===== 로그인 화면 ===== */
#login { position:absolute; top:50%; left:50%;
         margin:-190px 0 0 -464px; width:928px; height:380px; }
#login .tit { margin-bottom:18px; }
#login .tit h1, #login .tit h2 { display:inline-block; }
#login .tit h1 { margin:0 34px 0 38px; }
#login .login_con { box-sizing:border-box; padding:60px 60px 0;
                    width:928px; height:306px; background:#094A9A; }
#login .login_con h3 { margin-bottom:34px; }
#login .login_con .login_area { position:relative; overflow:hidden; }
#login .login_con .login_area > div { float:left; overflow:hidden; }
#login .id_w { position:relative; padding-right:125px;
               border-right:1px solid #46639B; }
#login .id_w > p { table-layout:fixed; display:table; margin-bottom:8px; }
#login .id_w > p > label,
#login .id_w > p > span { display:table-cell; }
#login .id_w > p > label { width:110px; height:32px; vertical-align:middle;
                           color:#fff; font-weight:bold; }
#login .id_w > p > span input { box-sizing:border-box; padding:0 5px;
                                width:184px; height:32px; border:none;
                                background-color:#E0E0E0; }
#login .id_w .txt { padding-top:10px; font-weight:bold;
                    color:#E2E0E1; font-size:11px; }
.btn_login { display:block; position:absolute; top:0; left:300px;
             box-sizing:border-box; padding-top:27px;
             width:86px; height:72px; cursor:pointer;
             text-align:center; font-weight:bold; font-size:13px;
             border:1px solid #CFCFCF; background-color:#F6F6F6; }
#login .login_con .login_area > div ul { float:left; margin-left:38px; }
#login .login_area > div ul.last { margin-left:10px; }
#login .login_area > div ul li { width:175px; }
#login .login_area > div ul.last li { width:150px; }
#login .login_area > div ul li:first-child { margin-bottom:10px; }
.btn_etc  { display:block; box-sizing:border-box; padding:13px 0 0 13px;
            height:43px; font-weight:bold; cursor:pointer;
            border:3px solid #DFDFDF; background:#F3F3F3; }
.btn_etc2 { display:block; box-sizing:border-box; padding:6px 0 0 8px;
            height:43px; font-weight:bold; cursor:pointer;
            border:3px solid #DFDFDF; background:#F3F3F3; }

/* ===== 공지 팝업 ===== */
#noti_pop .tit_pop { overflow:hidden; background-color:#094A9A; }
#noti_pop .tit_pop h1 { float:left; padding:15px; color:#fff;
                        font-weight:bold; font-size:14px; }
#noti_pop .tit_pop p { float:right; margin-right:10px; }
#noti_pop .con_pop { padding:20px; }
#noti_pop .con_pop .block  { margin-bottom:20px; }
#noti_pop .con_pop .block2 { margin-bottom:20px; line-height:1.5em; }

/* ===== 시간표 출력 화면 ===== */
.leftT { float:left; width:100%; height:320px; overflow-y:auto;
         border-width:1px 1px 2px; border-style:solid; border-color:#B7B7B7; }
.timeT { table-layout:fixed; font-size:12px; }
.timeT.rightT { float:right; width:28%; }
.timeT th, .timeT td { box-sizing:border-box; padding:0; height:1px;
                       text-align:center; }
.timeT th     { border-top:1px solid #3D75BB; background-color:#D3D3D3; }
.timeT .sun   { background-color:#F6E0E0; }
.timeT .sat   { background-color:#C3DDEF; }
.timeT .blue2 { background-color:#0082A7; }
.timeT .grey2 { background-color:#B7B7B7; }
```

### 미포함

`jquery-confirm.min.css` (166개 규칙) — CAPTCHA 모달용. 오픈소스이므로 원본을 받는다: `craftpip/jquery-confirm`

---

## 7. 디자인 토큰

```css
/* 타이포그래피 */
--font-family: Dotum, Gulim, 돋움, 굴림, arial, sans-serif;
--font-base:   12px;   /* 본문·테이블 셀 */
--font-header: 14px;   /* 상단 학기 헤더 */
--font-small:  11px;   /* 메뉴 탭, 버튼 */
--font-tiny:   10px;   /* 영문 라벨 <font size="1"> */

/* 본문 화면 */
--navy-900:    #0F4EAB;  /* 상단 헤더 .titY 배경 */
--blue-label:  #D6DFF0;  /* perT 라벨 셀 배경 */
--blue-header: #E0E8F5;  /* dataT 헤더 배경 */
--blue-topline:#3E74BA;  /* dataT 헤더 상단선 2px */
--blue-en:     #16529B;  /* 영문 라벨 */
--blue-text:   #004096;  /* 신청 버튼 글씨 */
--blue-border: #1F5CB7;  /* 신청 버튼 테두리 */
--blue-print:  #306FB6;  /* 확인서출력 배경 */
--orange:      #D95C00;  /* 시간표출력 배경 */
--red-border:  #C80606;  /* 취소 버튼 테두리 */
--red-text:    #CA0000;  /* 취소 버튼 글씨 */
--text:        #333333;
--text-muted:  #848484;  /* 마감강좌·비활성 */
--maroon:      #800000;  /* 야간학과 */
--cyan:        #0082A7;
--border:      #B7B7B7;  /* 테이블 셀 */
--border-lt:   #CCCBC9;  /* perT */
--border-tab:  #CDCDCD;  /* 메뉴 탭 */
--bg-btn:      #F2F2F2;
--bg-tab:      #F3F3F3;

/* 로그인 화면 */
--login-navy:   #094A9A;  /* 로그인 박스, 팝업 헤더 */
--login-divide: #46639B;  /* 입력영역 우측 구분선 */
--login-input:  #E0E0E0;  /* 입력 필드 배경 */
--login-hint:   #E2E0E1;  /* 안내 문구 */
--btn-bg:       #F6F6F6;
--etc-border:   #DFDFDF;  /* 바로가기 테두리 3px */
```

> 본문 헤더 `#0F4EAB`와 로그인 박스 `#094A9A`는 **다른 남색**이다. 통일하지 말 것.

### 컴포넌트 실측

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

### 재현 시 핵심 3가지

1. **Dotum/Gulim 폰트** — 이게 없으면 색을 맞춰도 다른 사이트로 보인다
2. **`border-radius: 0`** — 전 요소 모서리가 각져 있다
3. **12px 본문 / 11px 버튼** — 요즘 기준으로 매우 작다. 키우면 밀도가 완전히 달라진다

---

## 8. 텍스트 전문

### 8.1 로그인 화면

```yaml
title:                     # 이미지 (h1 로고 + h2). CI 교체 대상
  ko: 인천대학교 대학 수강신청
  en: Undergraduate Course Registration

heading: LOGIN

form:
  - label: "학번 (ID)"        input: text
  - label: "비밀번호 (PW)"     input: password    # ← 모의 사이트에서는 제거
  button:
    line1: 로그인
    line2: (Login)

hint: "* 학번(ID) / 비밀번호(PW)는 포털시스템과 동일합니다."
link: "학번(ID)/ 비밀번호(PW) 찾기"

shortcuts:
  ul1:
    - { class: btn_etc,  text: "수강신청안내" }
    - { class: btn_etc,  text: "환경설정 및 유의사항" }
  ul2 (.last):
    - { class: btn_etc,  text: "대학원 수강신청" }
    - { class: btn_etc2, text: "교수-자녀간 수강신청\n[사전신고 안내]" }

footer_notes:              # 박스 하단
  - "※ 수강신청 URL https://sugang.inu.ac.kr"           # 파란색
  - "※ 모의 수강신청(INTIP) https://intip.inuappcenter.kr/timetable/simulator"  # 파란색
  - "※ 호환성 문제에 따라 반드시 'Chrome' 또는 'Edge' 브라우저를
      사용하여 수강신청하시기 바랍니다.(Safari 등 사용 불가)"    # 붉은색
```

**모의 사이트 권장 변경**

| 원본 | 대체 |
|---|---|
| `인천대학교 대학 수강신청` + CI | 로고 플레이스홀더 + 자체 명칭 |
| `비밀번호 (PW)` + `type="password"` | 필드 제거 |
| `* 학번(ID) / 비밀번호(PW)는 포털시스템과 동일합니다.` | `* 연습용입니다. 아무 값이나 입력하세요.` |
| 하단 안내 3줄 | `⚠️ 비공식 연습용 사이트 — 실제 수강신청과 무관합니다` |

### 8.2 상단 학적 정보

```yaml
titY:  "2026년도 2학기 수강신청 / 2026 Fall course registration"
labels:
  - { ko: "학과(부)",      en: "Department" }
  - { ko: "학번/성명",     en: "ID/Name" }
  - { ko: "학년/학적상태",  en: "Grade" }
```

### 8.3 메뉴 탭 (한/영 `<br>` 병기)

```yaml
tabs:
  Basket:  { ko: 장바구니,           en: Cart }
  Jungong: { ko: 전공과목,           en: Major }
  Gyoyang: { ko: 교양과목,           en: "Liberal Arts" }
  Tagwa:   { ko: 타학과과목,         en: "Other Major" }
  Yungae:  { ko: 연계전공과목,       en: "Interdisciplinary Courses" }
  Huss:    { ko: HUSS전공과목,       en: "HUSS Courses" }
  Custom:  { ko: "과목명(코드) 조회", en: "Search by Course Title(Code)" }
reports:
  regiP:   { ko: 확인서출력,  en: "Print Confirmation" }
  scheP:   { ko: 시간표출력,  en: "Print Time table" }
notice:    "※ 주의(전공) : 검정색→주간학과 수업 / 고동색→야간학과 / 회색→마감강좌"
```

### 8.4 화면 제목 (`>>` 접두, 평문 `<td>`)

```
>> 장바구니        >> 전공과목        >> 교양과목       >> 타학과과목
>> 연계전공과목    >> HUSS과목        >> 과목명(코드)조회
```

> 메뉴 탭 이름과 미묘하게 다르다. `HUSS과목` ≠ `HUSS전공과목`, `과목명(코드)조회`는 공백 없음.

### 8.5 검색 영역 라벨

```
>> 전공과목                                          (조건 없음)
>> 교양과목      → [이수구분 ▼] → [이수영역 ▼]  [조회 (Search)]
>> 타학과과목    → [학과(부) ▼]                  [조회 (Search)]
>> 연계전공과목  → [연계전공 ▼]                  [조회 (Search)]
>> HUSS과목                                          (조건 없음)
>> 과목명(코드)조회 → [텍스트입력]               [조회 (Search)]
>> 장바구니                                          (조건 없음)
```

### 8.6 화면별 안내 문구

**HUSS와 장바구니에는 안내 문구가 없다.** 화면 제목 바로 다음에 테이블이 온다.

```yaml
Jungong: |
  * <수강신청> 개설 강좌 리스트 선택부분입니다.
  ▤ 학수번호가 달라도 교과목명이 같으면 동일 과목이므로 중복 수강입니다.   # 붉은색 굵게
  ▤ 학과에 문의하여 지도를 받은 후 수강신청 하시기 바랍니다.

Gyoyang: |
  * <수강신청> 교양과목 : 기초교양, 핵심교양, 심화교양, 교직, 군사학, 일반선택 등.
  ▤ 기초교양, 핵심교양, 심화교양 교과목에 대한 수강문의는 기초교육원으로 하시기 바랍니다.
  ▤ 학과에 문의하여 지도를 받은 후 수강신청 하시기 바랍니다.
  ▤ 화면에서 원하는 조건을 선택하시고 조회를 누르세요.
  ▤ 기초교양, 핵심교양, 심화교양을 선택하면 이수영역별 지정 조회가 가능 합니다.

Tagwa: |
  * <수강신청> 타학과 개설강좌리스트 입니다.
  ▤ 화면에서 원하는 조건을 선택하시고 조회를 누르세요.

Yungae: |
  * <수강신청> 연계전공 개설강좌리스트 입니다.
  ▤ 화면에서 원하는 조건을 선택하시고 조회를 누르세요.

Custom: |
  * <수강신청> 과목명 개설강좌리스트 입니다.
  ▤ 두글자 이상의 과목명 또는 학수번호를 입력하신 후 조회를 누르세요.
```

안내 영역 배경은 연한 파랑(`#EFF5FC` 계열), 불릿은 `▤`.

### 8.7 신청내역 헤더

```
수강신청내역 List of Courses registrered ( * 삭제시 삭제할 과목의 취소버튼을 클릭하세요. )
```

> 원문 오탈자: `registrered` (r 중복). `가능 합니다` 띄어쓰기도 원문 그대로. 재현 여부는 선택.

---

## 9. 신청 / 취소 플로우

```
[신청] 클릭
   ↓
CAPTCHA 모달 (매회)
   ↓ 정답 입력
보류된 요청 자동 수행
   ↓
검증 통과 → alert(성공)  |  검증 실패 → alert(에러)
   ↓
신청내역 테이블에 행 추가

[취소] 클릭 → confirm → alert(취소 완료) → 행 제거
```

### 9.1 CAPTCHA 모달

```yaml
title: 수강신청 매크로 방지
trigger: 신청 버튼 클릭 시 매회
image: 4자리 숫자 + 노이즈 배경 (배경색 랜덤: 주황/노랑 관측)
body:
  - "1. 이미지에 보이는 숫자 4글자를 입력하고 \"확인\" 버튼을 클릭하세요."
  - "   Enter the four-digits number(string) that appears in the image and click the \"Confirm\" button."
  - "2. 오류 누적 횟수가 10회가 되면 자동 로그아웃 됩니다."
  - "   (문자열 오류 총 10회 중 N회 남음)"
  - "   If the string is still incorrect more than 10 times, you will be log out automatically."
  - "   (Total : 10  Remain : N)"
  - "3. 입력한 문자열이 맞을 경우 이전 요청이 자동 수행됩니다."
input_label: "※ 문자열 입력 :"
confirm_button: "확인(Confirm)"
close_button: "닫기"
error: |                       # 모달 하단, 파란 굵은 글씨
  문자열을 잘 못 입력하였습니다. 다시 입력하세요.
  You entered the wrong string. Try again...
style: 흰 배경 + 파란 테두리 내부 박스 (jquery-confirm)
```

**동작 관측**
- 이미지는 매 시도마다 재생성
- 오답 시 모달 유지, 에러 문구만 하단 추가
- `Remain` 카운터: 10 → 8 관측. 오답 1회당 2 차감되거나 시도가 2회로 계산되는 것으로 보이나 표본 부족
- 10회 소진 시 자동 로그아웃

> **모의 사이트에서는 CAPTCHA를 넣지 않는 것을 권장한다.** 연습 효율만 떨어뜨린다. 굳이 넣는다면 발동 확률을 낮추거나 스킵 옵션을 둘 것.

### 9.2 메시지 전문

전부 **브라우저 네이티브 `alert()` / `confirm()`** 이다. CAPTCHA만 커스텀 모달.

| 상황 | 타입 | 메시지 |
|---|---|---|
| 신청 성공 | alert | `{교과목명} 교과목 신청이 완료되었습니다.\n Application completed.` |
| 취소 확인 | confirm | `신청하신 과목을 취소하시겠습니까?` |
| 취소 완료 | alert | `수강취소가 완료되었습니다.\n Application canceled.` |
| 시간표 중복 | alert | `신청된 교과목과 시간이 중복되어 신청할 수 없습니다.\n Duplicated time table.` |
| 동일 과목명 | alert | `동일한 과목명을 이미 신청 하였습니다.\n Duplicated Subject.` |

**포맷 규칙**: 한글 문장 + `\n` + **공백 1칸** + 영문
**원문 오탈자**: `신청 하였습니다` (띄어쓰기), CAPTCHA의 `잘 못 입력`

> 예쁜 커스텀 모달로 바꾸면 실제와 체감이 달라진다. 연습 목적이라면 `window.alert` / `window.confirm`을 그대로 쓸 것.

### 9.3 미확보 메시지 — 자체 작성

기존 톤에 맞춘 제안.

```js
학점 초과: `신청 가능 학점을 초과하여 신청할 수 없습니다.\n Credit limit exceeded.`
마감 강좌: `해당 강좌는 마감되었습니다.\n Class is full.`
세션 만료: `세션이 만료되었습니다. 다시 로그인하세요.\n Session expired.`
기간 아님: `수강신청 기간이 아닙니다.\n Not in registration period.`
```

---

## 10. 검증 규칙

### 10.1 우선순위 (관측 기반)

```
1. CAPTCHA 통과          실패 시 요청 보류, 재시도
2. 시간표 중복 검사       Duplicated time table
3. 동일 과목명 검사       Duplicated Subject
4. 학점 상한 검사         (미관측 — 자체 정의)
5. 정원 검사             마감 버튼으로 사전 차단
```

**2번과 3번은 독립적이다.** 시간이 겹치지 않아도 교과목명이 같으면 차단된다.
(검증: `게임프로그래밍` IAA6066001(화 2 3, 목 5 6) 신청 후 IAA6066002(수 5 6, 목 7 8) 시도 → 시간 미겹침에도 `Duplicated Subject`)

### 10.2 이수구분은 파생값이다

**중요**: 이수구분은 강좌의 고정 속성이 아니라 `(학생 소속 × 강좌 개설학과)` 로 산출된다.

| | 조회 화면 | 신청내역 |
|---|---|---|
| 경영프로그래밍2 (0012410001) | **전공심화** | **일반선택** |

컴퓨터공학부 학생이 경영학부 과목을 신청하니 값이 바뀌었다.

```
Course.courseType         ← 개설학과 기준 (조회 화면용)
Enrollment.resolvedType   ← 학생 기준 재계산 (신청내역용)
```

이 구분을 놓치면 신청 후 표시가 실제와 달라진다.

### 10.3 기타 동작

| 항목 | 동작 |
|---|---|
| `마감` 버튼 | 클릭 불가 (핸들러 없음) |
| 재수강 구분 | 신규 신청 시 빈 값 |
| **신청 후 조회 목록** | **갱신 안 됨** — 해당 행이 여전히 `신청` 파란 버튼 유지 |
| 신청내역 | 즉시 행 추가, 순번 1부터 부여 |
| 결과 0건 | 헤더만 렌더링, tbody 비움. **"결과 없음" 안내 문구 없음** |

> 마지막 두 항목은 원본의 UX 결함에 가깝다. 모의 사이트에서 그대로 갈지 개선할지 결정 필요.

---

## 11. 시간표 문법

```
화 5B-6 (14-202) 수 7-8A (14-202)
│  │      │
│  │      └ 강의실 (건물-호실). 07-505 = 7호관 505호
│  └ 교시
└ 요일
```

**교시 표기 3종**

| 형식 | 예 | 의미 |
|---|---|---|
| 단순 연속 | `1 2 3` | 1,2,3교시 |
| 범위 + 접미 | `5B-6`, `7-8A` | 75분수업 블록 |
| 범위 | `1-2A`, `2B-3` | |

- 복수 시간대는 공백으로 이어붙임
- 온라인 강좌는 시간표가 **빈 문자열**
- 인턴십 등은 `월 1 2 3 4 5 6 7 8 9 (ZZ-102)` × 5일 형태 (`ZZ` = 가상 건물)
- 화면에서는 `text-overflow: ellipsis`로 잘려 보임

---

## 12. 모의 사이트 추가 구현 항목

원본에는 있으나 이 명세로 커버되지 않는 것, 또는 연습 효과를 위해 추가할 것.

| 요소 | 구현 |
|---|---|
| 서버 지연 | 응답에 200~800ms 랜덤 지연 |
| 동시 경쟁 | 서버 시계 기준 오픈 시각 + 정원 선착순 |
| 대기열 | 오픈 직후 N초 대기 화면 (원본 NetFunnel 대응) |
| 실패율 | 일정 확률로 타임아웃·세션 만료 |
| 서버 시간 동기화 | `Date` 헤더 기준 오프셋 계산 — **연습의 핵심** |

### 데이터 모델 최소 스키마

```
Course     { id, code, name, nameEn, professor, credits, capacity,
             enrolled, courseType, courseArea, department, grade,
             schedule[], tags[], isNight, isClosed }
Enrollment { studentId, courseId, resolvedType, reAttendance, createdAt }
Student    { id, name, department, grade, status, creditLimit }
```

> 원본 조회 화면에는 **정원·신청인원 컬럼이 없다.** `마감`/`신청` 이진 상태만 노출한다. 모의 사이트에서 이를 그대로 갈지 개선할지는 설계 결정 사항.

---

## 부록: 확보하지 않은 것

의도적으로 조사하지 않았거나 접근 불가한 항목.

| 항목 | 사유 |
|---|---|
| `macroChk` 내부 로직 | 탐지 회피 지식이 되므로 미조사 |
| NetFunnel 연동 코드 | 대기열 우회로 이어질 수 있어 미조사 |
| 서버 엔드포인트·파라미터 | 모의 사이트에 불필요 |
| JSP 서버 소스 | 서버 실행이므로 접근 불가 |
| 학점 상한 실제 값 | 학사요람/수강신청안내 페이지 참조 필요 |
| 학교 CI·로고 이미지 | 교체 대상이므로 미수집 |
