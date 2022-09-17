import React, { useEffect } from 'react'
import { ADDUSER } from '../mutations'
import { useField } from '../utils/utils'
import { useMutation } from '@apollo/client'



const AddUser = () => {
  const username = useField('text')
  const password = useField('password')
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
    } catch (err: any) {
      console.log(err.message)
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


export default AddUser