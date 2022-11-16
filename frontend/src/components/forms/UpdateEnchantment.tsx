import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UPDATEENCHANTMENT } from '../../mutations'
import { useField } from '../../utils/utils'
import Form from './Form'
import { useMutation } from '@apollo/client'


const UpdateEnchantment = () => {
  const [queryParameters] = useSearchParams()
  const id = queryParameters.get('id')
  if (!id) {
    return <div>No id specified</div>
  }
  const name = useField('text', 'Name', undefined)
  //String will be parsed to array
  const games = useField('text', 'Games', 'Syntax: game1 game2')
  const tier = useField('number', 'Tier', undefined)
  const damage = useField('text', 'Damage', undefined)
  //String will be parsed to array
  const damageTypes = useField('text', 'DamageTypes', 'Syntax: type1 type2')
  const description = useField('text', 'Description', undefined)
  const [ updateEnchantment, result ] = useMutation(UPDATEENCHANTMENT)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await updateEnchantment({
        variables: {
          id,
          name: name.value ? name.value : undefined,
          games: games.value ? games.value.split(' ') : undefined,
          tier: tier.value ? Number(tier.value) : undefined,
          damage: damage.value ? damage.value : undefined,
          damageTypes: damageTypes.value ? damageTypes.value.split(' ') : undefined,
          description: description.value ? description.value : undefined,
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
    'Update Enchantment'
  )
  return form
}

export default UpdateEnchantment