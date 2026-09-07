import { useState } from 'react'
import { CourseScreen } from '@/features/sukang/components/CourseScreen'
import { SearchLinkedSelect } from '@/features/sukang/components/SearchLinkedSelect'
import {
  EMPTY_FLD_GNB,
  isFldGnbParentCode,
  type FldGnbParentCode,
  type FldGnbSelection,
} from '@/features/sukang/constants/codes'
import { useSearchSubmit, type CourseParams } from '@/features/sukang/hooks'

export function GyoyangScreen() {
  const [cptnGbn, setCptnGbn] = useState('')
  const [fldGnb, setFldGnb] = useState<FldGnbSelection>(EMPTY_FLD_GNB)
  const { submitted, submit } = useSearchSubmit('Gyoyang')

  const onCptnGbnChange = (code: string) => {
    setCptnGbn(code)
    setFldGnb(EMPTY_FLD_GNB)
  }
  const onFldGnbChange = (parent: FldGnbParentCode, code: string) =>
    setFldGnb((prev) => ({ ...prev, [parent]: code }))

  const onSearch = () => {
    if (!cptnGbn) return
    const params: CourseParams<'Gyoyang'> = { cptnGbn }
    if (isFldGnbParentCode(cptnGbn) && fldGnb[cptnGbn]) params.fldGnb = fldGnb[cptnGbn]
    submit(params)
  }

  return (
    <CourseScreen
      screen="Gyoyang"
      params={submitted}
      search={
        <SearchLinkedSelect
          cptnGbn={cptnGbn}
          fldGnb={fldGnb}
          onCptnGbnChange={onCptnGbnChange}
          onFldGnbChange={onFldGnbChange}
        />
      }
      onSearch={onSearch}
    />
  )
}
