import React from 'react'
import { Field, SubmitEvent } from '../../utils/types'

//TODO add support for array fields
const Form = (submit:SubmitEvent, fields: Field[], buttonName: string) => {
  return (
    <div>
      <form onSubmit={submit}>
        {fields.map(field => {
          const { name, ...values } = field
          return <div key={name}>{name}: <input {...values }/></div>
        })}
        <div><button>{buttonName}</button></div>
      </form>
    </div>
  )
}

export default Form