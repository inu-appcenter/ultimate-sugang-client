#!/usr/bin/env node
// SessionStart 훅: 세션 시작/재개 시 하네스 상태를 컨텍스트에 주입해 복구를 결정적으로 만든다.
// phase=INIT → harness-init 안내. phase=BUILD → 재개 항목 + 무결성 경고. 항상 exit 0(비차단).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSpecPresence } from './checks/spec-presence.mjs';

const here = dirname(fileURLToPath(import.meta.url));      // .claude/hooks
const statePath = join(here, '..', 'build-state.json');    // .claude/build-state.json
const out = (msg) => process.stdout.write(msg + '\n');

if (!existsSync(statePath)) {
  out('[하네스] build-state.json 부재 — 템플릿 설치가 불완전. resource/HARNESS.md 설치 절차 확인.');
  process.exit(0);
}

let s;
try { s = JSON.parse(readFileSync(statePath, 'utf8')); }
catch { out('[하네스] build-state.json 파싱 불가 — 사용자에게 보고(🙋🏻).'); process.exit(0); }

const phase = s.meta?.phase || 'INIT';

if (phase === 'INIT') {
  out('[하네스] phase=INIT — 아직 초기화 전. 명세를 받으면 harness-init 스킬로 인테이크 시작.');
  out('  (spec/ 은 이 단계에서만 쓰기 가능. init 완료 시 phase=BUILD 로 전환되며 읽기전용이 된다.)');
  process.exit(0);
}

// phase=BUILD: 설치 정합성 — spec/ 파일명이 참조와 어긋나면 즉시 경고(비차단).
const specWarns = checkSpecPresence(join(here, '..', 'spec'));
if (specWarns.length) {
  out('[하네스 설치 경고] spec/ 파일명이 참조와 불일치 — Read 깨짐 위험:');
  for (const w of specWarns) out('  - ' + w);
}

const checklist = Array.isArray(s.checklist) ? s.checklist : [];
const inprog = checklist.filter(c => c.status === 'IN_PROGRESS');
const resume = checklist.find(c => c.status === 'TODO' || c.status === 'IN_PROGRESS');
const done = checklist.filter(c => c.status === 'COMPLETED' || c.status === 'SKIPPED').length;

const lines = ['[하네스 복구 신호] 진행의 유일한 권위 = build-state.json 의 checklist.'];
if (inprog.length > 1) {
  lines.push(`⚠️ IN_PROGRESS 가 ${inprog.length}개 — 상태 손상. 진행 금지, 사용자에게 보고(🙋🏻).`);
}
if (resume) {
  lines.push(`재개 항목: ${resume.id} (status=${resume.status}). 진척: ${done}/${checklist.length} 완료.`);
  lines.push('→ build-orchestrator 스킬로 Phase 0 복구부터 시작.');
} else {
  lines.push('모든 checklist 항목 완료/스킵 — 남은 재개 항목 없음.');
}
out(lines.join('\n'));
process.exit(0);
