import React, { useEffect } from 'react'
import { ADDGAME } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'
import { toRarityDefinitions } from '../../utils/parsers'


const AddGame = () => {
  const name = useField('text', 'Name')
  // Enchantments should be added later into the game. Currently not supported.
  const rarities = useField('text', 'Rarities')
  const [ addGame, result ] = useMutation(ADDGAME)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addGame({
        variables: {
          name: name.value,
          rarities: toRarityDefinitions(rarities.value)
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
    'Add game'
  )
  return form
}


export default AddGame