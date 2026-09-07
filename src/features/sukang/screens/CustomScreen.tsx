import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CourseScreen } from '@/features/sukang/components/CourseScreen'
import { SearchText } from '@/features/sukang/components/SearchText'
import { useSearchSubmit } from '@/features/sukang/hooks'
import { CustomSearchFormSchema, type CustomSearchForm } from '@/features/sukang/schemas'

export function CustomScreen() {
  const { submitted, submit } = useSearchSubmit('Custom')
  const form = useForm<CustomSearchForm>({
    resolver: zodResolver(CustomSearchFormSchema),
    defaultValues: { q: '' },
  })
  const onSearch = form.handleSubmit(({ q }) => submit({ q }))

  return (
    <CourseScreen
      screen="Custom"
      params={submitted}
      search={
        <SearchText
          id="custom-q"
          registration={form.register('q')}
          onEnter={() => void onSearch()}
        />
      }
      onSearch={() => void onSearch()}
    />
  )
}
