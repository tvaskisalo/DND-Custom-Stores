import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UPDATESTORE } from '../../mutations'
import { useField } from '../../utils/utils'
import Form from './Form'
import { useMutation } from '@apollo/client'
import { toitemRarityProbabilities } from '../../utils/parsers'

const UpdateStore = () => {
  const [queryParameters] = useSearchParams()
  const id = queryParameters.get('id')
  if (!id) {
    return <div>No id specified</div>
  }
  const name = useField('text', 'Name', undefined)
  const games = useField('text', 'Games', 'Syntax: game1 game2')
  const itemRarityProbabilities = useField('text', 'itemRarityProbabilities', 'Syntax: Common 50, Rare 50')
  const capacity = useField('number', 'Capacity', undefined)
  const [ updateStore, result ] = useMutation(UPDATESTORE)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await updateStore({
        variables: {
          id,
          name: name.value ? name.value : undefined,
          games: games.value ? games.value.split(' ') : undefined,
          itemRarityProbabilities: itemRarityProbabilities.value ? toitemRarityProbabilities(itemRarityProbabilities?.value) : undefined,
          capacity: capacity.value ? Number(capacity.value) : undefined
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
    'Update game')
  return form
}

export default UpdateStore