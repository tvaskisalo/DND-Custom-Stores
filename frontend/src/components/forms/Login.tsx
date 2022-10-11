import React, { useEffect } from 'react'
import { LOGIN } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import Form from './Form'


const Login = ({ setToken }) => {
  const username = useField('text', 'Username')
  const password = useField('password', 'Password')
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
  const form = Form(submit, [username, password], 'Login')
  return form
}

Login.propTypes = {
  setToken: PropTypes.func
}

export default Login