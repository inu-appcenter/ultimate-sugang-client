interface SearchSelectProps {
  id: string
  placeholder: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
}

export function SearchSelect({ id, placeholder, options, value, onChange }: SearchSelectProps) {
  return (
    <td>
      <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </td>
  )
}
