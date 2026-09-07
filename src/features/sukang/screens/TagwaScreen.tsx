import { useState } from 'react'
import { CourseScreen } from '@/features/sukang/components/CourseScreen'
import { SearchSelect } from '@/features/sukang/components/SearchSelect'
import { PLACEHOLDERS, TAGWA_LIST } from '@/features/sukang/constants/codes'
import { useSearchSubmit } from '@/features/sukang/hooks'

export function TagwaScreen() {
  const [selected, setSelected] = useState('')
  const { submitted, submit } = useSearchSubmit('Tagwa')
  const onSearch = () => {
    if (!selected) return
    submit({ tagwaCd: selected })
  }
  return (
    <CourseScreen
      screen="Tagwa"
      params={submitted}
      search={
        <SearchSelect
          id="cmbTagwaCd"
          placeholder={PLACEHOLDERS.cmbTagwaCd}
          options={TAGWA_LIST}
          value={selected}
          onChange={setSelected}
        />
      }
      onSearch={onSearch}
    />
  )
}
