import { SearchSpacer } from '@/features/sukang/components/SearchSpacer'
import {
  CPTN_GBN,
  FLD_GNB,
  FLD_GNB_PARENT_CODES,
  PLACEHOLDERS,
  type FldGnbParentCode,
  type FldGnbSelection,
} from '@/features/sukang/constants/codes'

interface SearchLinkedSelectProps {
  cptnGbn: string
  fldGnb: FldGnbSelection
  onCptnGbnChange: (code: string) => void
  onFldGnbChange: (parent: FldGnbParentCode, code: string) => void
}

export function SearchLinkedSelect({
  cptnGbn,
  fldGnb,
  onCptnGbnChange,
  onFldGnbChange,
}: SearchLinkedSelectProps) {
  const visibleChild = FLD_GNB_PARENT_CODES.find((code) => code === cptnGbn)
  return (
    <>
      <td>
        <select
          id="cmbCptnGbn"
          name="cmbCptnGbn"
          value={cptnGbn}
          onChange={(e) => onCptnGbnChange(e.target.value)}
        >
          <option value="">{PLACEHOLDERS.cmbCptnGbn}</option>
          {CPTN_GBN.map((o) => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>
      </td>
      <SearchSpacer hidden={visibleChild === undefined} />
      <td hidden={visibleChild === undefined}>→</td>
      <SearchSpacer hidden={visibleChild === undefined} />
      <td hidden={visibleChild === undefined}>
        {FLD_GNB_PARENT_CODES.map((parent) => (
          <select
            key={parent}
            id={`cmbFldGnb${parent}`}
            name={`cmbFldGnb${parent}`}
            hidden={parent !== visibleChild}
            value={fldGnb[parent]}
            onChange={(e) => onFldGnbChange(parent, e.target.value)}
          >
            <option value="">{PLACEHOLDERS.cmbFldGnb}</option>
            {FLD_GNB[parent].map((o) => (
              <option key={o.code} value={o.code}>
                {o.name}
              </option>
            ))}
          </select>
        ))}
      </td>
    </>
  )
}
