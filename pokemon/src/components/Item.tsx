import { FC, useState, useEffect } from "react"
import axios from "axios"

export const Item: FC<any> = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  useEffect(() => {
    const fetch = async () => {
      const pokes = await getPokemons()
      setPokemons(pokes)
    }
    fetch()
  }, [])
  return (
    <>
      {pokemons.map((pokemon) => (
        <div>
          <p key={pokemon.name}>{pokemon.name}:</p>
          {/* <img key={pokemon.url} src={pokemon.url}></img> */}
        </div>
      ))}
    </>
  )
}

type Pokemon = {
  name: string
  url: string
}

const getPokemons = async (): Promise<Pokemon[]> => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10")
  const summaries = res.data.results

  const pokemons: Pokemon[] = []

  for (const summary of summaries) {
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${summary.name}`
    )
    const pokemon = res.data
    const formUrl = pokemon.forms[0].url
    const formData = await axios.get(formUrl)
    const imgUrl = formData.data.sprites.front_default
    const imgData = await axios.get(imgUrl)
    const img = imgData.data

    pokemons.push({
      name: pokemon.name,
      url: img,
    })
  }
  return pokemons
}
