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

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await login({
        variables: {
          username: username.value,
          password: password.value
        }
      })
    } catch (err: any) {
      console.log(err)
    }
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