import React, { useEffect } from 'react'
import { ADDGAME } from '../mutations'
import { useField } from '../utils/utils'
import { useMutation } from '@apollo/client'



const AddGame = () => {
  const Gamename = useField('text')
  const [ addGame, result ] = useMutation(ADDGAME)

  useEffect(() => {
    console.log(result.data)
  }, [result.data])

  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await addGame({
        variables: {
          name: Gamename.value
        }
      })
    } catch (err: any) {
      console.log(err.message)
    }
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div>Gamename <input { ...Gamename }/></div>
        <div><button>login</button></div>
      </form>
    </div>
  )
}


export default AddGame