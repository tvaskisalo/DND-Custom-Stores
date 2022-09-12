import React, { useEffect } from 'react'
import { LOGIN } from '../queries'
import { useField } from '../utils/utils'
import { useMutation } from '@apollo/client'



const Login = () => {
  const username = useField('text')
  const password = useField('password')
  const [ login, result ] = useMutation(LOGIN)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    login({
      variables: {
        username: username.value,
        password: password.value
      }
    })
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