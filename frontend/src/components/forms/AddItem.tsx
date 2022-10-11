import React, { useEffect } from 'react'
import { ADDITEM } from '../../mutations'
import { useField } from '../../utils/utils'
import { useMutation } from '@apollo/client'
import Form from './Form'


const AddItem = () => {
  const name = useField('text','Name')
  const material = useField('text','Material')
  const baseCost = useField('number','Basecost')
  const weight = useField('number','Weight')
  const properties = useField('text','Properties')
  const damage = useField('text','Damage')
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
          material: material.value,
          baseCost: baseCost.value,
          weight: weight.value,
          properties: properties.value,
          damage: damage.value,
          baseItem: baseItem.value,
          unique: unique.value,
          weapon: weapon.value,
          weaponType: weaponType.value,
          armor: armor.value,
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
      material,
      baseCost,
      weight,
      properties,
      damage,
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