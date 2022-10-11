import react, { useState } from 'react'
import { Field } from './types'

export function useField(type: string, name: string): Field {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    name,
    type,
    value,
    onChange
  }
}


