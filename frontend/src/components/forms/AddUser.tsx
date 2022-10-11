import React, { useEffect } from 'react'
import { ADDUSER } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'



const AddUser = () => {
  const username = useField('number', 'Username')
  const password = useField('password', 'Password')
  const [ addUser, result ] = useMutation(ADDUSER)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addUser({
        variables: {
          username: username.value,
          password: password.value
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  const form = Form(submit, [username, password], 'Sign up')
  return form
}


export default AddUser