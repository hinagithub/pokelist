import { FC, useState, useEffect } from "react"
import axios from "axios"
import { Pokemon, PokeAPIType, TypeName } from "../types/pokemon"
import { ItemCard } from "./ItemCard"
import Grid from '@mui/material/Grid';

let typeNames: TypeName[]

export const PokemonList: FC<any> = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [types, setTypes] = useState<TypeName[]>([])

  useEffect(() => {
    const fetch = async () => {
      const types = await getTypeNames()
      setTypes(types)
      typeNames = types
      const pokes = await getPokemons()
      setPokemons(pokes)
    }
    fetch()
  }, [])
  return (
    <>
      <Grid container>
        {pokemons.map((pokemon, i) => (
          <Grid item key={i} xs={12} md={6} xl={3} sx={{ py: 2, px: 2 }}>
            <ItemCard id={pokemon.id} name={pokemon.name} url={pokemon.url} types={pokemon.types}></ItemCard>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

const getPokemons = async (): Promise<Pokemon[]> => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=15")
  const summaries = res.data.results
  const pokemons: Pokemon[] = []

  for (const summary of summaries) {
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${summary.name}`
    )

    const pokemon = res.data
    const name = await getName(pokemon)
    const url = getImageUrl(pokemon)
    const types = getTypes(pokemon)

    pokemons.push({
      id: pokemon.id,
      name,
      url,
      types,
    })
  }
  return pokemons
}

const getImageUrl = (pokemon: any): string => {
  return pokemon.sprites.other["official-artwork"].front_default
}

const getName = async (pokemon: any): Promise<string> => {
  const speciesUrl = pokemon.species.url;
  const responseSpecies = await axios.get(speciesUrl);
  const names = responseSpecies.data.names;
  const name = names.find((v: any) => v.language.name == "ja").name
  return name
}

const getTypes = (pokemon: any): string[] => {
  const types = pokemon.types.map((t: PokeAPIType) => {
    const globalTypeName = typeNames.find((typeName: TypeName) => {
      return typeName.en.toLowerCase() === t.type.name
    })
    return globalTypeName?.ja
  })
  return types
}

const getTypeNames = async (): Promise<TypeName[]> => {
  const typeSummaries = await axios.get("https://pokeapi.co/api/v2/type")
  const types = []
  for (const summary of typeSummaries.data.results) {
    const typeDetail = await axios.get("https://pokeapi.co/api/v2/type/" + summary.name)
    const globalTypeNames = typeDetail.data.names
    const en = globalTypeNames.find((n: { language: { name: string } }) => n.language.name === "en")?.name
    const ja = globalTypeNames.find((n: { language: { name: string } }) => n.language.name === "ja")?.name
    types.push({ en, ja })
  }
  return types
}