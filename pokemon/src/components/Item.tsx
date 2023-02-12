import { FC, useState, useEffect } from "react"
import axios from "axios"
import { Pokemon, PokeAPIType } from "../types/pokemon"

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
        <div key={pokemon.id}>
          <img src={pokemon.url}></img>
          <p> No. {pokemon.id}</p>
          <p>{pokemon.name}</p>
          {pokemon.types.map((t) => (
            <p>{t}</p>
          ))}
        </div>
      ))}
    </>
  )
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
    const url = await getImageUrl(pokemon.forms[0].url)
    const types = getTypes(pokemon.types)

    pokemons.push({
      id: pokemon.id,
      name: pokemon.name,
      url,
      types,
    })
  }
  return pokemons
}

const getImageUrl = async (formUrl: string): Promise<string> => {
  const formData = await axios.get(formUrl)
  return formData.data.sprites.front_default
}

const getTypes = (typeInfo: PokeAPIType[]): string[] => {
  const types = typeInfo.map((t: PokeAPIType) => t.type.name)
  return types
}

