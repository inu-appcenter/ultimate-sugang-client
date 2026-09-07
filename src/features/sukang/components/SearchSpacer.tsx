// 검색행의 요소 간격은 이 스페이서 td 가 만든다 → .claude/spec/convention/02_ui.md §4
export function SearchSpacer({ hidden = false }: { hidden?: boolean }) {
  return <td width="10px" hidden={hidden} />
}
