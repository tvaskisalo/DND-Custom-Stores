import itemGenerator from '../utils/itemGenerator'
import { ItemTypeProbability } from '../utils/types'

describe('Generating item rarities', () => {
  test('Capacity 1, itemrarities 1', () => {
    const capacity = 1
    const itemTypeProbabilities: ItemTypeProbability[] = [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemTypeProbabilities, undefined)
    expect(itemRarities.length).toBe(1)
    expect(itemRarities[0]).toBe('Common')
  })
  test('Capacity 4, itemrarities 2, constant seed', () => {
    const capacity = 4
    const itemTypeProbabilities: ItemTypeProbability[] = [
      {
        rarity: 'Common',
        probability: 50
      },
      {
        rarity: 'Uncommon',
        probability: 50
      }
    ]
    const seed = 'test'
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemTypeProbabilities, seed)
    expect(itemRarities.length).toBe(4)
    expect(itemRarities).toEqual(['Uncommon', 'Common', 'Uncommon', 'Common'])
  })
  test('Capacity 10, itemrarities: 6, consant seed', () => {
    const capacity = 10
    const itemTypeProbabilities: ItemTypeProbability[] = [
      {
        rarity: 'Common',
        probability: 25
      },
      {
        rarity: 'Uncommon',
        probability: 25
      },
      {
        rarity: 'Rare',
        probability: 20
      },
      {
        rarity: 'Very Rare',
        probability: 15
      },
      {
        rarity: 'Legendary',
        probability: 10
      },
      {
        rarity: 'Unique',
        probability: 5
      },
    ]
    const seed = 'test'
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemTypeProbabilities, seed)
    expect(itemRarities.length).toBe(10)
    expect(itemRarities).toEqual([
      'Legendary', 'Uncommon',
      'Unique',    'Uncommon',
      'Uncommon',  'Uncommon',
      'Uncommon',  'Common',
      'Very Rare', 'Uncommon'
    ])
  })
  //This might fail due to variance, but it should be REALLY unlikely. If it fails check your code to be sure
  test('Capacity 1000000, itemRarities 6', () => {
    const capacity = 1000000
    const itemTypeProbabilities: ItemTypeProbability[] = [
      {
        rarity: 'Common',
        probability: 25
      },
      {
        rarity: 'Uncommon',
        probability: 25
      },
      {
        rarity: 'Rare',
        probability: 20
      },
      {
        rarity: 'Very Rare',
        probability: 15
      },
      {
        rarity: 'Legendary',
        probability: 10
      },
      {
        rarity: 'Unique',
        probability: 5
      },
    ]
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemTypeProbabilities, undefined)
    expect(itemRarities.length).toBe(capacity)
    //This tests that each rarity shows up in the array the correct amount of times compared to its probability
    const commons = itemRarities.filter(r => r==='Common')
    expect(Math.round((commons.length/capacity)*100)).toBe(25)

    const uncommons = itemRarities.filter(r => r==='Uncommon',)
    expect(Math.round((uncommons.length/capacity)*100)).toBe(25)

    const rares = itemRarities.filter(r => r==='Rare',)
    expect(Math.round((rares.length/capacity)*100)).toBe(20)

    const veryRares = itemRarities.filter(r => r==='Very Rare')
    expect(Math.round((veryRares.length/capacity)*100)).toBe(15)

    const legendaries = itemRarities.filter(r => r==='Legendary')
    expect(Math.round((legendaries.length/capacity)*100)).toBe(10)

    const uniques = itemRarities.filter(r => r==='Unique')
    expect(Math.round((uniques.length/capacity)*100)).toBe(5)
  })
})