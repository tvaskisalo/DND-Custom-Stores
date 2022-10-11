import React, { useEffect } from 'react'
import { ADDSTORE } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'


const AddStore = () => {
  const name = useField('text','Name')
  const [ addStore, result ] = useMutation(ADDSTORE)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addStore({
        variables: {
          name: name.value
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  const form = Form(submit, [name], 'Add game')
  return form
}


export default AddStore