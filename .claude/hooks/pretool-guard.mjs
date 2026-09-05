#!/usr/bin/env node
// PreToolUse 훅: 위험/비가역 작업 차단. stdin 으로 hook JSON 수신.
// 차단: exit 2 + stderr 사유. 통과: exit 0.
// spec/ 쓰기 차단은 phase=BUILD 에서만 — INIT 동안은 harness-init 이 SoT 문서를 생성해야 하므로 허용.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));   // .claude/hooks
let phase = 'INIT';
try {
  const statePath = join(here, '..', 'build-state.json');
  if (existsSync(statePath)) phase = JSON.parse(readFileSync(statePath, 'utf8'))?.meta?.phase || 'INIT';
} catch { /* 상태 손상 시 INIT 취급(부트스트랩 가능해야 함) — validate-state 가 별도로 잡는다 */ }
const specLocked = phase === 'BUILD';

let raw = '';
process.stdin.on('data', d => (raw += d));
process.stdin.on('end', () => {
  let ev = {};
  try { ev = JSON.parse(raw || '{}'); } catch { process.exit(0); }
  const tool = ev.tool_name || '';
  const input = ev.tool_input || {};
  const block = (reason) => { process.stderr.write('차단: ' + reason + '\n'); process.exit(2); };

  if (tool === 'Bash') {
    const cmd = String(input.command || '');
    const danger = [
      [/rm\s+-rf?\s+(\/|~|\.\.)/, '광범위 삭제(rm -rf)'],
      [/git\s+push/, 'git push(원격 반영, --force 포함) — 사람이 수행'],
      [/gh\s+(release|pr\s+merge|repo\s+delete)/, 'gh 원격 반영(release/merge/delete) — 사람이 수행'],
      [/npm\s+publish|yarn\s+publish|pnpm\s+publish/, '패키지 publish — 사람이 수행'],
      [/(vercel|netlify|firebase|gh-pages)\s+deploy|--prod\b/, '배포 — 사람이 수행'],
      [/curl[^|]*\|\s*(sh|bash)/, '원격 스크립트 실행'],
    ];
    if (specLocked) danger.push([/(>|>>)\s*[^\s|]*\.claude\/spec\//, 'spec/ 는 읽기전용 지식(phase=BUILD) — 쓰기 금지']);
    for (const [re, msg] of danger) if (re.test(cmd)) block(msg);
  }
  if (/^(Write|Edit|MultiEdit)$/.test(tool)) {
    const fp = String(input.file_path || input.path || '').replace(/\\/g, '/');
    // phase=BUILD 에서 spec/ 는 읽기전용. 단 00_INDEX.md 는 도메인 내용이 아닌 네비게이션 메타라 예외.
    if (specLocked && /\.claude\/spec\//.test(fp) && !/\.claude\/spec\/00_INDEX\.md$/.test(fp)) {
      block('.claude/spec/ 는 읽기전용 지식(SoT, phase=BUILD) — 수정 금지 (00_INDEX.md 만 예외)');
    }
    if (/(^|\/)\.env(\.|$)/.test(fp)) block('.env 비밀값은 사람이 입력 — 구조만 생성');
  }
  process.exit(0);
});
