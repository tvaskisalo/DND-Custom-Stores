import React, { useEffect } from 'react'
import { ADDSTORE } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'
import { toitemRarityProbabilities } from '../../utils/parsers'


const AddStore = () => {
  const name = useField('text', 'Name')
  const games = useField('text', 'Games')
  const itemRarityProbabilities = useField('text', 'itemRarityProbabilities')
  const capacity = useField('number', 'Capacity')
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
          itemRarityProbabilities: toitemRarityProbabilities(itemRarityProbabilities?.value),
          capacity: Number(capacity.value)
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
      itemRarityProbabilities,
      capacity
    ],
    'Add game')
  return form
}


export default AddStore