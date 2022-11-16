import React from 'react'
import { buttonClassName, inputClassName } from '../../utils/syling'
import { Field, SubmitEvent } from '../../utils/types'

//TODO add support for array fields
const Form = (submit:SubmitEvent, fields: Field[], buttonName: string) => {
  return (
    <div className='inline-block px-8 py-8'>
      <form className='grid grid-cols-2 gap-4'onSubmit={submit}>
        {fields.map(field => {
          const { name, note, ...values } = field
          return <div key={name}>
            {name}: <input id={name + 'Input'} className ={ inputClassName } {...values }/>
            <div>{note}</div>
          </div>
        })}
        <div><button className={ buttonClassName }>{buttonName}</button></div>
      </form>
    </div>
  )
}

export default Form