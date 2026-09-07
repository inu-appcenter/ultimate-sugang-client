import { useState } from 'react'
import { CourseScreen } from '@/features/sukang/components/CourseScreen'
import { SearchSelect } from '@/features/sukang/components/SearchSelect'
import { PLACEHOLDERS, YUNGAE_LIST } from '@/features/sukang/constants/codes'
import { useSearchSubmit } from '@/features/sukang/hooks'

export function YungaeScreen() {
  const [selected, setSelected] = useState('')
  const { submitted, submit } = useSearchSubmit('Yungae')
  const onSearch = () => {
    if (!selected) return
    submit({ yungaeCd: selected })
  }
  return (
    <CourseScreen
      screen="Yungae"
      params={submitted}
      search={
        <SearchSelect
          id="cmbYungaeCd"
          placeholder={PLACEHOLDERS.cmbYungaeCd}
          options={YUNGAE_LIST}
          value={selected}
          onChange={setSelected}
        />
      }
      onSearch={onSearch}
    />
  )
}
