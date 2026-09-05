# smoke/ — Playwright 스모크 테스트

QA Step 에서 최고위험 흐름의 `*.spec.ts` 를 여기에 작성한다. `hooks/checks/smoke.sh` 가 이 폴더를 실행하며, 스펙 파일이 없으면 정상 스킵한다(QA 이전 게이트를 막지 않기 위함).
