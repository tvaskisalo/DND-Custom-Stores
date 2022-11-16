import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UPDATEGAME } from '../../mutations'
import { useField } from '../../utils/utils'
import Form from './Form'
import { useMutation } from '@apollo/client'
import { toRarityDefinitions } from '../../utils/parsers'

const UpdateGame = () => {
  const [queryParameters] = useSearchParams()
  const id = queryParameters.get('id')
  if (!id) {
    return <div>No id specified</div>
  }
  const name = useField('text', 'Name', undefined)
  // Enchantments should be added later into the game. Currently not supported.
  const rarities = useField('text', 'Rarities', 'Syntax: Common 1, Uncommon 1 2 ')
  const [ updateGame, result ] = useMutation(UPDATEGAME)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await updateGame({
        variables: {
          id,
          name: name.value ? name.value : undefined,
          rarities: rarities.value ? toRarityDefinitions(rarities.value) : undefined
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
      rarities
    ],
    'Update game'
  )
  return form
}

export default UpdateGame