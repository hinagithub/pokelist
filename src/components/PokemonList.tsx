import { FC, useState, useEffect } from "react"
import axios from "axios"
import { Pokemon, PokeAPIType, TypeName } from "../types/pokemon"
import { ItemCard } from "./ItemCard"
import { Box, Button } from "@mui/material"
import { BsSortAlphaDown, BsSortNumericDown, BsStars } from "react-icons/bs"
import { Grid } from "@mui/material"
import { Search } from "./Search"

export const PokemonList: FC<any> = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [fullPokemons, setFullPokemons] = useState<Pokemon[]>([])
  const [masterTypeNames, setMasterTypeNames] = useState<TypeName[]>([])
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<string[]>([])
  const [searchWord, setSearchWord] = useState<string>("")

  useEffect(() => {
    const fetch = async () => {
      const masterTypeNames = await getTypeNames()
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
        const types = getTypes(pokemon, masterTypeNames)

        pokemons.push({
          id: pokemon.id,
          name,
          url,
          types,
        })
      }
      setMasterTypeNames(masterTypeNames)
      setPokemons(pokemons)
      setFullPokemons(pokemons)
    }
    fetch()
  }, [])

  /**
   * インクリメント検索
   */
  const handleKeyUp = (e: any): void => {
    const key = e.key
    if (!(key === "Enter" || key === "Backspace" || key === "Delete")) return
    console.log(`${key}キー押下`)
    const value = e.target.value ? e.target.value : ""
    filterPokemons(selectedFilterTypes, value)
  }

  /**
   * 番号順にソート
   */
  const sortById = () => {
    console.log("番号順ボタン押下")
    const sorted = [...pokemons].sort((a: Pokemon, b: Pokemon) => {
      return a.id > b.id ? 1 : -1
    })
    setPokemons(sorted)
  }

  /**
   * アイウエオ順にソート
   */
  const sortByJapanese = () => {
    console.log("アイウエオ順ボタン押下")
    const sorted = [...pokemons].sort((a: Pokemon, b: Pokemon) => {
      return a.name > b.name ? 1 : -1
    })
    setPokemons(sorted)
  }

  /**
   * リセット
   */
  const resetList = () => {
    console.log("リセットボタン押下")
    setPokemons(fullPokemons)
    setSelectedFilterTypes([])
  }

  /**
   * タイプフィルタ
   */
  const handleClickType = (type: string): void => {
    console.log("タイプ押下", type)
    // 選択中のタイプの配列を更新。すでに選択されていれば削除し、なければ追加する
    const index = selectedFilterTypes.findIndex((v: string) => v === type)
    const selected =
      index === -1
        ? [...selectedFilterTypes, type]
        : selectedFilterTypes.filter((v: string) => v !== type)
    setSelectedFilterTypes(selected)
    filterPokemons(selected, searchWord)
  }

  /**
   * タイプ・検索文字フィルタ
   */
  const filterPokemons = (selectedTypes: string[], word: string = "") => {
    // タイプ・検索文字が設定されていなければ全ポケモンを設定
    if (selectedTypes.length === 0 && !word) {
      setPokemons(fullPokemons)
      return
    }

    // まず検索文字でフィルタ
    const searchedPokemons = word
      ? fullPokemons.filter((pokemon: Pokemon) => {
        return pokemon.name.includes(word)
      })
      : fullPokemons

    // さらにタイプでフィルタ
    const filtered =
      selectedTypes.length === 0
        ? searchedPokemons
        : searchedPokemons.filter((pokemon: Pokemon) => {
          let included = false
          for (const type of pokemon.types) {
            if (selectedTypes.includes(type)) {
              included = true
              break
            }
          }
          return included
        })

    setPokemons(filtered)
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
    const speciesUrl = pokemon.species.url
    const responseSpecies = await axios.get(speciesUrl)
    const names = responseSpecies.data.names
    const name = names.find((v: any) => v.language.name == "ja").name
    return name
  }

  /**
   * ポケモンタイプ名を日本語に変換
   */
  const getTypes = (pokemon: any, masterTypeNames: TypeName[]): string[] => {
    const types = pokemon.types.map((t: PokeAPIType) => {
      const globalTypeName = masterTypeNames.find((typeName: TypeName) => {
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
      const typeDetail = await axios.get(
        "https://pokeapi.co/api/v2/type/" + summary.name
      )
      const globalTypeNames = typeDetail.data.names
      const en = globalTypeNames.find(
        (n: { language: { name: string } }) => n.language.name === "en"
      )?.name
      const ja = globalTypeNames.find(
        (n: { language: { name: string } }) => n.language.name === "ja"
      )?.name

      // 一部の英語名("???"と"shadow")は日本語がundefinedなので除外
      if (en && ja) {
        types.push({ en, ja })
      }
    }
    return types
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Search
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            handleKeyUp={handleKeyUp}
          ></Search>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          p: 0,
          pb: 2,
          mx: 10,
          backgroundColor: "transparent",
        }}
      >
        {masterTypeNames.map((typename, i) => (
          <div>
            {selectedFilterTypes.includes(typename.ja) && (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ borderRadius: 10 }}
                onClick={() => handleClickType(typename.ja)}
              >
                {typename.ja}
              </Button>
            )}
            {!selectedFilterTypes.includes(typename.ja) && (
              <Button
                variant="text"
                color="secondary"
                size="large"
                sx={{ borderRadius: 10 }}
                onClick={() => handleClickType(typename.ja)}
              >
                {typename.ja}
              </Button>
            )}
          </div>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          p: 0,
          pb: 2,
          mx: 10,
          backgroundColor: "transparent",
        }}
      >
        <Button
          variant="text"
          color="secondary"
          size="large"
          sx={{ borderRadius: 10 }}
          startIcon={<BsSortNumericDown />}
          onClick={sortById}
        >
          番号順
        </Button>
        <Button
          variant="text"
          color="secondary"
          size="large"
          sx={{ borderRadius: 10 }}
          startIcon={<BsSortAlphaDown />}
          onClick={sortByJapanese}
        >
          アイウエオ順
        </Button>
        <Button
          variant="text"
          color="secondary"
          size="large"
          sx={{ borderRadius: 10 }}
          startIcon={<BsStars />}
          onClick={resetList}
        >
          リセット
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          p: 0,
          mx: 1,
          backgroundColor: "transparent",
        }}
      >
        {pokemons.map((pokemon, i) => (
          <div style={{ margin: 10, padding: 10 }} key={i}>
            <ItemCard
              id={pokemon.id}
              name={pokemon.name}
              url={pokemon.url}
              types={pokemon.types}
            ></ItemCard>
          </div>
        ))}
      </Box>
    </>
  )
}
