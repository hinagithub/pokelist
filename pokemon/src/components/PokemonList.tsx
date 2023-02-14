import { FC, useState, useEffect, useContext } from "react"
import axios from "axios"
import { Pokemon, PokeAPIType, TypeName } from "../types/pokemon"
import { ItemCard } from "./ItemCard"
import { Box, Button } from "@mui/material";
import { SearchWordContext } from "../providers/SerchWordProvider";
import { BsSortAlphaDown, BsSortNumericDown } from "react-icons/bs";

const typeNames: TypeName[] = []

export const PokemonList: FC<any> = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const { searchWord } = useContext(SearchWordContext)
  console.log("searchWord @PokeList", searchWord)

  useEffect(() => {
    const fetch = async () => {
      const types = await getTypeNames()
      typeNames.push(...types)
      const pokes = await getPokemons()
      setPokemons(pokes)
    }
    fetch()
  }, [])


  /**
   * アイウエオ順にソート
   */
  const sortPokemonListByJapaneseName = () => {
    console.log("アイウエオ順ボタン押下")
    // 単純にpokemons.sort(...)としたら更新されない。ヒント: in-placeアルゴリズム
    const sorted = [...pokemons].sort((a: Pokemon, b: Pokemon) => {
      return a.name > b.name ? 1 : -1
    })
    setPokemons(sorted)
  }

  /**
   * 番号順にソート
   */
  const sortPokemonListById = () => {
    console.log("番号順ボタン押下")
    // 単純にpokemons.sort(...)としたら更新されない。ヒント: in-placeアルゴリズム
    const sorted = [...pokemons].sort((a: Pokemon, b: Pokemon) => {
      return a.id > b.id ? 1 : -1
    })
    setPokemons(sorted)
  }


  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          p: 0,
          mx: 1,
          backgroundColor: 'transparent',
        }}
      >
        <Button
          variant="text"
          color="secondary"
          size="large"
          sx={{ borderRadius: 10 }}
          startIcon={<BsSortAlphaDown />}
          onClick={sortPokemonListByJapaneseName}
        >
          アイウエオ順
        </Button>
        <Button
          variant="text"
          color="secondary"
          size="large"
          sx={{ borderRadius: 10 }}
          startIcon={<BsSortNumericDown />}
          onClick={sortPokemonListById}
        >
          番号順
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          p: 0,
          mx: 1,
          backgroundColor: 'transparent',
        }}
      >
        {pokemons.map((pokemon, i) => (
          <div style={{ "margin": 10, "padding": 10 }} key={i}>
            <ItemCard id={pokemon.id} name={pokemon.name} url={pokemon.url} types={pokemon.types}></ItemCard>
          </div>
        ))}
      </Box>
    </>
  )
}

/**
 * ポケモン一覧取得
 */
const getPokemons = async (): Promise<Pokemon[]> => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=30")
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

/**
 * ポケモン画像URL取得
 */
const getImageUrl = (pokemon: any): string => {
  return pokemon.sprites.other["official-artwork"].front_default
}

/**
 * ポケモンの名前を日本語に変換
 */
const getName = async (pokemon: any): Promise<string> => {
  const speciesUrl = pokemon.species.url;
  const responseSpecies = await axios.get(speciesUrl);
  const names = responseSpecies.data.names;
  const name = names.find((v: any) => v.language.name == "ja").name
  return name
}

/**
 * ポケモンタイプ名を日本語に変換
 */
const getTypes = (pokemon: any): string[] => {
  const types = pokemon.types.map((t: PokeAPIType) => {
    const globalTypeName = typeNames.find((typeName: TypeName) => {
      return typeName.en.toLowerCase() === t.type.name
    })
    return globalTypeName?.ja
  })
  return types
}

/**
 * ポケモン日本語タイプ名一覧取得
 */
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
