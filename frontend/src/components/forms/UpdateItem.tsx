import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UPDATEITEM } from '../../mutations'
import { useField } from '../../utils/utils'
import Form from './Form'
import { useMutation } from '@apollo/client'


const UpdateItem = () => {
  const [queryParameters] = useSearchParams()
  const id = queryParameters.get('id')
  if (!id) {
    return <div>No id specified</div>
  }
  const name = useField('text', 'Name', undefined)
  //Currently given a string that will be parsed to an array.
  const games = useField('text', 'Games', 'Syntax: game1 game2')
  //Currently given a string that will be parsed to an array.
  const storePool = useField('text', 'StorePool', 'Syntax: store1 store2')
  const material = useField('text', 'Material', undefined)
  const baseCost = useField('number', 'Basecost', undefined)
  const weight = useField('number', 'Weight', undefined)
  const properties = useField('text', 'Properties', undefined)
  const damage = useField('text', 'Damage', undefined)
  //Currently given a string that will be parsed to an array.
  const damageTypes = useField('text', 'DamageTypes', 'Syntax: type1 type2')
  const baseItem = useField('boolean', 'BaseItem', undefined)
  const unique = useField('boolean', 'Unique', undefined)
  const weapon = useField('boolean', 'Weapon', undefined)
  const weaponType = useField('text', 'WeaponType', undefined)
  const armor = useField('boolean', 'Armor', undefined)
  const armorType = useField('text', 'ArmorType', undefined)
  const armorClass = useField('text', 'ArmorClass', undefined)
  const strength = useField('text', 'Strength', undefined)
  const stealth = useField('text', 'Stealth', undefined)
  const [ updateItem, result ] = useMutation(UPDATEITEM)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await updateItem({
        variables: {
          id,
          name: name.value ? name.value : undefined,
          games: games.value ? games.value.split(' ') : undefined,
          storePool: storePool.value ? storePool.value.split(' ') : undefined,
          material: material.value ? material.value : undefined,
          baseCost: baseCost.value ? Number(baseCost.value) : undefined,
          weight: weight.value ? Number(weight.value) : undefined,
          properties: properties.value ? properties.value : undefined,
          damage: damage.value ? damage.value : undefined,
          damageTypes: damageTypes.value ? damageTypes.value.split(' ') : undefined,
          baseItem: baseItem.value ? baseItem.value.toLowerCase() === 'true' : undefined,
          unique: unique.value ? unique.value.toLowerCase() === 'true' : undefined,
          weapon: weapon.value ? weapon.value.toLowerCase() === 'true' : undefined,
          weaponType: weaponType.value ? weaponType.value : undefined,
          armor: armor.value ? armor.value.toLowerCase() === 'true' : undefined,
          armorType: armorType.value ? armorType.value : undefined,
          armorClass: armorClass.value ? armorClass.value : undefined,
          strength: strength.value ? strength.value : undefined,
          stealth: stealth.value ? stealth.value : undefined
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
      storePool,
      material,
      baseCost,
      weight,
      properties,
      damage,
      damageTypes,
      baseItem,
      unique,
      weapon,
      weaponType,
      armor,
      armorType,
      armorClass,
      strength,
      stealth
    ],
    'Update item')
  return form
}

export default UpdateItem