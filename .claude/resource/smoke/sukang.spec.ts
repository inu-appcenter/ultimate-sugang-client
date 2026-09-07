import { expect, test, type Page } from '@playwright/test'

/**
 * 03 §9 스모크 후보 1~10 — 메시지는 원문(`\n` + 공백 1칸) 정확 일치 단언. 각 테스트는 새 컨텍스트(mock 초기 상태·신청내역 0건).
 */
const STUDENT_ID = '2022XXXXX'
const MSG = {
  enrollOk: (name: string) => `${name} 교과목 신청이 완료되었습니다.\n Application completed.`,
  dupSubject: '동일한 과목명을 이미 신청 하였습니다.\n Duplicated Subject.',
  dupTime: '신청된 교과목과 시간이 중복되어 신청할 수 없습니다.\n Duplicated time table.',
  cancelConfirm: '신청하신 과목을 취소하시겠습니까?',
  cancelOk: '수강취소가 완료되었습니다.\n Application canceled.',
  printUnsupported: '연습 사이트에서는 지원하지 않습니다.',
}

type Dialog = { type: string; message: string }

function captureDialogs(page: Page, confirmAction: () => 'accept' | 'dismiss' = () => 'accept'): Dialog[] {
  const dialogs: Dialog[] = []
  page.on('dialog', async (d) => {
    dialogs.push({ type: d.type(), message: d.message() })
    if (d.type() === 'confirm' && confirmAction() === 'dismiss') await d.dismiss()
    else await d.accept()
  })
  return dialogs
}

async function login(page: Page) {
  await page.goto('/')
  await page.fill('#login-studentId', STUDENT_ID)
  await page.keyboard.press('Enter')
  await page.waitForURL('**/sukang')
}

async function openTab(page: Page, ko: string, tableLabel: string) {
  await page.locator('a.btn_re', { hasText: ko }).first().click()
  await page.locator(`table[aria-label="${tableLabel}"] tbody tr`).first().waitFor()
}

const jungongRow = (page: Page, code: string) =>
  page.locator(`table[aria-label="전공과목"] tbody tr:has(td:text-is("${code}"))`)
const enrollRows = (page: Page) => page.locator('table[aria-label="수강신청내역"] tbody tr')
const enrollRow = (page: Page, code: string) =>
  page.locator(`table[aria-label="수강신청내역"] tbody tr:has(td:text-is("${code}"))`)

test('1. 로그인(학번) → /sukang 진입 → perT 에 {학번} / {성명}', async ({ page }) => {
  await login(page)
  await expect(page.locator('table.perT')).toContainText(`${STUDENT_ID} / 홍○○`)
  await expect(page.locator('table.perT')).toContainText('4 / 유예')
  // D54: 비밀번호 필드는 로그인 화면 재현 전용(값 미사용) — 수강신청 화면에는 존재하지 않는다
  await expect(page.locator('input[type="password"]')).toHaveCount(0)
})

test('7. 미로그인 /sukang 직접 접근 → / 리다이렉트', async ({ page }) => {
  await page.goto('/sukang')
  await page.waitForURL((u) => u.pathname === '/')
  await expect(page.locator('#login')).toBeVisible()
  // D54 §2.4: 로그인 화면은 원본과 같이 비밀번호 행을 갖는다(시각 재현 전용 — 값은 읽지 않는다)
  await expect(page.locator('#login input[type="password"]')).toHaveCount(1)
})

test('8. 로그인 직후 랜딩 상태(D35): 제목·결과 영역 없음, 전공과목 안내 박스, 신청내역 헤더만', async ({ page }) => {
  await login(page)
  await expect(page.locator('.sch_areaT')).toHaveCount(0)
  await expect(page.locator('.sjt_sch')).toHaveCount(0)
  await expect(page.locator('.guide_box')).toHaveCount(1)
  await expect(page.locator('.guide_box')).toContainText('* <수강신청> 개설 강좌 리스트 선택부분입니다.')
  await expect(page.locator('.guide_box .em_red')).toHaveText(
    '▒ 학수번호가 달라도 교과목명이 같으면 동일 과목이므로 중복 수강입니다.',
  )
  await expect(page.locator('table[aria-label="수강신청내역"] thead th')).toHaveCount(11)
  await expect(enrollRows(page)).toHaveCount(0)
})

test('2. 전공과목 신청 → ENROLL_OK → 신청내역 행 추가(순번 1) → 조회 목록 버튼은 여전히 신청(D33)', async ({ page }) => {
  const dialogs = captureDialogs(page)
  await login(page)
  await openTab(page, '전공과목', '전공과목')
  await jungongRow(page, '0010925001').locator('a.btn_blue').click()
  await expect.poll(() => dialogs.length).toBe(1)
  expect(dialogs[0]).toEqual({ type: 'alert', message: MSG.enrollOk('자연어처리') })
  await expect(enrollRow(page, '0010925001')).toHaveCount(1)
  await expect(enrollRow(page, '0010925001').locator('td').first()).toHaveText('1')
  await expect(enrollRow(page, '0010925001').locator('td').nth(1)).toHaveText('전공심화')
  await expect(jungongRow(page, '0010925001').locator('a.btn_blue')).toHaveText('신청')
})

test('3. 동일 과목명 다른 분반 → DUP_SUBJECT (시간 미겹침, 시드 §2.4)', async ({ page }) => {
  const dialogs = captureDialogs(page)
  await login(page)
  await openTab(page, '전공과목', '전공과목')
  await jungongRow(page, 'IAA6066001').locator('a.btn_blue').click()
  await expect.poll(() => dialogs.length).toBe(1)
  await jungongRow(page, 'IAA6066002').locator('a.btn_blue').click()
  await expect.poll(() => dialogs.length).toBe(2)
  expect(dialogs[1]).toEqual({ type: 'alert', message: MSG.dupSubject })
  await expect(enrollRows(page)).toHaveCount(1)
})

test('3b. 시간표 중복 → DUP_TIME (아이디어와 창업 화 7 8 9 + 블록체인 화 7-8A, 시드 §4)', async ({ page }) => {
  const dialogs = captureDialogs(page)
  await login(page)
  await page.locator('a.btn_re', { hasText: '교양과목' }).first().click()
  await page.selectOption('#cmbCptnGbn', '80')
  await page.locator('button.btn_search').click()
  await page.locator('table[aria-label="교양과목"] tbody tr').first().waitFor()
  await page.locator('table[aria-label="교양과목"] tbody tr:has(td:text-is("0005053001")) a.btn_blue').click()
  await expect.poll(() => dialogs.length).toBe(1)
  expect(dialogs[0]).toEqual({ type: 'alert', message: MSG.enrollOk('아이디어와 창업') })
  await expect(enrollRow(page, '0005053001').locator('td').nth(1)).toHaveText('일반선택')
  await openTab(page, '전공과목', '전공과목')
  await jungongRow(page, '0011922001').locator('a.btn_blue').click()
  await expect.poll(() => dialogs.length).toBe(2)
  expect(dialogs[1]).toEqual({ type: 'alert', message: MSG.dupTime })
  await expect(enrollRows(page)).toHaveCount(1)
})

test('6. 마감 행 클릭 → 아무 요청 없음 (btn_grey2 핸들러 없음)', async ({ page }) => {
  const dialogs = captureDialogs(page)
  await login(page)
  await openTab(page, '전공과목', '전공과목')
  await expect(jungongRow(page, '0006154050')).toHaveClass('grey')
  await jungongRow(page, '0006154050').locator('a.btn_grey2').click({ force: true })
  await page.waitForTimeout(900)
  expect(dialogs).toEqual([])
  await expect(enrollRows(page)).toHaveCount(0)
})

test('4. 취소: confirm 취소 → 무동작 / 확인 → CANCEL_OK → 행 제거', async ({ page }) => {
  let action: 'accept' | 'dismiss' = 'accept'
  const dialogs = captureDialogs(page, () => action)
  await login(page)
  await openTab(page, '전공과목', '전공과목')
  await jungongRow(page, '0010925001').locator('a.btn_blue').click()
  await expect.poll(() => dialogs.length).toBe(1)
  await expect(enrollRow(page, '0010925001')).toHaveCount(1)
  action = 'dismiss'
  await enrollRow(page, '0010925001').locator('a.btn_red').click()
  await expect.poll(() => dialogs.length).toBe(2)
  expect(dialogs[1]).toEqual({ type: 'confirm', message: MSG.cancelConfirm })
  await page.waitForTimeout(700)
  await expect(enrollRow(page, '0010925001')).toHaveCount(1)
  action = 'accept'
  await enrollRow(page, '0010925001').locator('a.btn_red').click()
  await expect.poll(() => dialogs.length).toBe(4)
  expect(dialogs[3]).toEqual({ type: 'alert', message: MSG.cancelOk })
  await expect(enrollRow(page, '0010925001')).toHaveCount(0)
})

test('5. 교양 이수구분 11/21/23 → 대응 이수영역 select 만 표시, 50/70/80 은 숨김', async ({ page }) => {
  await login(page)
  await page.locator('a.btn_re', { hasText: '교양과목' }).first().click()
  await expect(page.locator('#cmbFldGnb11, #cmbFldGnb21, #cmbFldGnb23')).toHaveCount(3)
  for (const [code, visible] of [
    ['11', '#cmbFldGnb11'],
    ['21', '#cmbFldGnb21'],
    ['23', '#cmbFldGnb23'],
  ] as const) {
    await page.selectOption('#cmbCptnGbn', code)
    await expect(page.locator(visible)).toBeVisible()
    for (const other of ['#cmbFldGnb11', '#cmbFldGnb21', '#cmbFldGnb23'].filter((id) => id !== visible))
      await expect(page.locator(other)).toBeHidden()
  }
  for (const code of ['50', '70', '80']) {
    await page.selectOption('#cmbCptnGbn', code)
    await expect(page.locator('#cmbFldGnb11')).toBeHidden()
    await expect(page.locator('#cmbFldGnb21')).toBeHidden()
    await expect(page.locator('#cmbFldGnb23')).toBeHidden()
  }
  await expect(page.locator('#cmbFldGnb11 option[value="162"]')).toHaveText('기초과학ㆍ공학')
})

test('9. 확인서출력/시간표출력 클릭 → alert (D23)', async ({ page }) => {
  const dialogs = captureDialogs(page)
  await login(page)
  await page.locator('a.btn_regiP').click()
  await page.locator('a.btn_scheP').click()
  await expect.poll(() => dialogs.length).toBe(2)
  expect(dialogs.map((d) => d.message)).toEqual([MSG.printUnsupported, MSG.printUnsupported])
})

test('11. D51 D2-01: 조건 화면은 조회 전 안내 박스만(.sch_areaT·결과 테이블 0개) → 조회 후 교체', async ({ page }) => {
  await login(page)
  await page.locator('a.btn_re', { hasText: '과목명(코드) 조회' }).first().click()
  await expect(page.locator('.sch_areaT')).toHaveCount(0)
  await expect(page.locator('table[aria-label="과목명(코드)조회"]')).toHaveCount(0)
  await expect(page.locator('.guide_box')).toHaveCount(1)
  await page.fill('#custom-q', '프로그래밍')
  await page.locator('button.btn_search').click()
  await expect(page.locator('.sch_areaT')).toHaveCount(1)
  await expect(page.locator('.guide_box')).toHaveCount(0)
})

test('10. 타학과 select 76 · 연계전공 32 · placeholder 원문 · 과목명 2자 미만 무동작', async ({ page }) => {
  await login(page)
  await page.locator('a.btn_re', { hasText: '타학과과목' }).first().click()
  await expect(page.locator('#cmbTagwaCd option')).toHaveCount(77)
  await expect(page.locator('#cmbTagwaCd option').first()).toHaveText('========== 학과(부) ==========')
  await page.locator('a.btn_re', { hasText: '연계전공과목' }).first().click()
  await expect(page.locator('#cmbYungaeCd option')).toHaveCount(33)
  await expect(page.locator('#cmbYungaeCd option', { hasText: 'MICE,스포츠및관광연계전공' })).toHaveCount(1)
  await page.locator('a.btn_re', { hasText: '과목명(코드) 조회' }).first().click()
  await page.fill('#custom-q', '프')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(700)
  await expect(page.locator('table[aria-label="과목명(코드)조회"] tbody tr')).toHaveCount(0)
  await page.fill('#custom-q', '프로그래밍')
  await page.keyboard.press('Enter')
  await expect(page.locator('table[aria-label="과목명(코드)조회"] tbody tr')).toHaveCount(10)
})

test('12. D55: 교강사 컬럼은 값이 비어도 폭 80px 고정(서버가 professor 를 항상 "" 로 준다)', async ({
  page,
}) => {
  const professorWidth = (label: string) =>
    page.evaluate((tableLabel) => {
      const table = document.querySelector(`table[aria-label="${tableLabel}"]`)
      if (!table) return null
      const headers = [...table.querySelectorAll('thead th')]
      const index = headers.findIndex((th) => th.textContent?.startsWith('교강사'))
      if (index < 0) return null
      const row = table.querySelector('tbody tr')
      return {
        th: headers[index].getBoundingClientRect().width,
        td: row?.children[index]?.getBoundingClientRect().width ?? null,
      }
    }, label)

  await login(page)
  // 신청내역(행 0건) — thead 만 있어도 colgroup 이 폭을 잡는다
  expect(await professorWidth('수강신청내역')).toEqual({ th: 80, td: null })

  await openTab(page, '전공과목', '전공과목')
  expect(await professorWidth('전공과목')).toEqual({ th: 80, td: 80 })

  // 서버 상태 재현: 교강사 셀을 전부 빈 값으로 만들어도 폭이 변하지 않아야 한다
  await page.evaluate(() => {
    const table = document.querySelector('table[aria-label="전공과목"]')
    const headers = [...(table?.querySelectorAll('thead th') ?? [])]
    const index = headers.findIndex((th) => th.textContent?.startsWith('교강사'))
    table?.querySelectorAll('tbody tr').forEach((tr) => {
      const cell = tr.children[index]
      if (cell) cell.textContent = ''
    })
  })
  expect(await professorWidth('전공과목')).toEqual({ th: 80, td: 80 })
})
