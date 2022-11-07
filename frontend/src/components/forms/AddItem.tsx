import React, { useEffect } from 'react'
import { ADDITEM } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'


const AddItem = () => {
  const name = useField('text','Name')
  //Currently given a string that will be parsed to an array.
  const games = useField('text','Games')
  //Currently given a string that will be parsed to an array.
  const storePool = useField('text','StorePool')
  const material = useField('text','Material')
  const baseCost = useField('number','Basecost')
  const weight = useField('number','Weight')
  const properties = useField('text','Properties')
  const damage = useField('text','Damage')
  //Currently given a string that will be parsed to an array.
  const damageTypes = useField('text','DamageTypes')
  const baseItem = useField('boolean','BaseItem')
  const unique = useField('boolean','Unique')
  const weapon = useField('boolean','Weapon')
  const weaponType = useField('text','WeaponType')
  const armor = useField('boolean','Armor')
  const armorType = useField('text','ArmorType')
  const armorClass = useField('text','ArmorClass')
  const strength = useField('text','Strength')
  const stealth = useField('text','Stealth')
  const [ addItem, result ] = useMutation(ADDITEM)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addItem({
        variables: {
          name: name.value,
          games: games.value?.split(' '),
          storePool: storePool.value?.split(' '),
          material: material.value,
          baseCost: Number(baseCost.value),
          weight: Number(weight.value),
          properties: properties.value,
          damage: damage.value,
          damageTypes: damageTypes.value?.split(' '),
          baseItem: baseItem.value ? baseItem.value.toLowerCase() === 'true' : undefined,
          unique: unique.value ? unique.value.toLowerCase() === 'true' : undefined,
          weapon: weapon.value ? weapon.value.toLowerCase() === 'true' : undefined,
          weaponType: weaponType.value,
          armor: armor.value ? armor.value.toLowerCase() === 'true' : undefined,
          armorType: armorType.value,
          armorClass: armorClass.value,
          strength: strength.value,
          stealth: stealth.value
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
    'Add item')
  return form
}


export default AddItem