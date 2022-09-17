import React, { useEffect } from 'react'
import { LOGIN } from '../mutations'
import { useField } from '../utils/utils'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'


const Login = ({ setToken }) => {
  const username = useField('text')
  const password = useField('password')
  const [ login, result ] = useMutation(LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      console.log(token)
      setToken(token)
      localStorage.setItem('DnD-user-token', token)
    }
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
    } catch (err) {
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

Login.propTypes = {
  setToken: PropTypes.func
}

export default Login