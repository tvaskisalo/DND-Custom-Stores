import React, { useEffect } from 'react'
import { ADDGAME } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'


const AddGame = () => {
  const name = useField('text','Name')
  const [ addGame, result ] = useMutation(ADDGAME)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addGame({
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


export default AddGame