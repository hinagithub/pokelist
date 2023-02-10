import { useState } from 'react'
import axios from 'axios'

export const useFetchPokemons = () => {
  // ポケモン一覧を取得するカスタムフック
  const [pokemonList, setPokemonList] = useState([{ name: 'pikachu' }])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const onClickFetchPokemon = () => {
    setIsLoading(true)
    setIsLoading(false)

    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=5')
      .then(res => {
        console.log(res.data.results)
        const pokemons = res.data.results.map(poke => {
          return {
            name: poke.name,
            url: poke.url
          }
        })
        setPokemonList(pokemons)
      })
      .catch(err => setIsError(err))
      .finally(() => setIsLoading(false))
  }

  return { pokemonList, isLoading, isError, onClickFetchPokemon }
}
