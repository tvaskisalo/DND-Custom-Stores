import React from 'react'
import { useField } from './utils'

function Login() {
  const username = useField('text')
  const password = useField('password')

  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    console.log(username.value)
    console.log(password.value)
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div>username <input { ...username }/></div>
        <div>password <input { ...password }/></div>
        <div><button>login</button></div>
      </form>
    </div>
  )
}


export default Login