import React, { useEffect } from 'react'
import { ADDSTORE } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'
import { toItemTypeProbabilities } from '../../utils/parsers'


const AddStore = () => {
  const name = useField('text','Name')
  const games = useField('text','Games')
  const itemTypeProbabilities = useField('text','ItemTypeProbabilities')
  const [ addStore, result ] = useMutation(ADDSTORE)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addStore({
        variables: {
          name: name.value,
          games: games.value?.split(' '),
          itemTypeProbabilities: toItemTypeProbabilities(itemTypeProbabilities?.value)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  const form = Form(
    submit,
    [
      name,
      games,
      itemTypeProbabilities
    ],
    'Add game')
  return form
}


export default AddStore