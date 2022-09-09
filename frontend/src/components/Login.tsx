import React from 'react'
import { loginService } from '../services/loginService'
import { useField } from '../utils/utils'
import { gql, useMutation } from '@apollo/client'



function Login() {
  const username = useField('text')
  const password = useField('password')
  const LOGIN =gql`
  mutation LOGIN($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    )
  }
  `
  const [ login ] = useMutation(LOGIN)
  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    console.log(username.value)
    console.log(password.value)
    const value = await login({
      variables: {
        username: username.value,
        password: password.value
      }
    })
    console.log(value)
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