import React, { useEffect } from 'react'
import { ADDENCHANTMENT } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'


const AddEnchantment = () => {
  const name = useField('text', 'Name', undefined)
  //String will be parsed to array
  const games = useField('text', 'Games', 'Syntax: game1 game2')
  const tier = useField('number', 'Tier', undefined)
  const damage = useField('text', 'Damage', undefined)
  //String will be parsed to array
  const damageTypes = useField('text', 'DamageTypes', 'Syntax: type1 type2')
  const description = useField('text', 'Description', undefined)
  const [ addEnchantment, result ] = useMutation(ADDENCHANTMENT)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addEnchantment({
        variables: {
          name: name.value,
          games: games.value?.split(' '),
          tier: Number(tier.value),
          damage: damage.value,
          damageTypes: damageTypes.value?.split(' '),
          description: description.value,
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  const form = Form(
    submit,
    [
      name,
      games,
      tier,
      damage,
      damageTypes,
      description
    ],
    'Add Enchantment'
  )
  return form
}

export default AddEnchantment