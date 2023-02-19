import { FC, useState, useEffect } from "react"
import { api } from "../api/pokemon"
import { Pokemon, PokeAPIType, TypeName } from "../types/pokemon"
import { ItemCard } from "./ItemCard"
import { IconBtn } from "./IconBtn"
import { Box, Button, CircularProgress } from "@mui/material"
import { BsSortAlphaDown, BsSortNumericDown, BsStars } from "react-icons/bs"
import { Grid } from "@mui/material"
import { Search } from "./Search"

export const PokemonList: FC<any> = () => {
  // ローディング
  const [isLoading, setIsLoading] = useState(false);
  // 全ポケモン一覧
  const [fullPokemons, setFullPokemons] = useState<Pokemon[]>([])
  // 表示中のポケモン一覧
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  // 全タイプ一覧
  const [masterTypeNames, setMasterTypeNames] = useState<TypeName[]>([])
  // 選択中のタイプ一覧
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<string[]>([])
  // 入力されている検索ワード
  const [searchWord, setSearchWord] = useState<string>("")

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const masterTypeNames = await getTypeNames()
      const data = await api.getPokemonSumarries(151)
      const pokemonSummary = data.results
      const pokemons: Pokemon[] = []
      for (const summary of pokemonSummary) {
        const pokemon = await api.getPokemonDetail(summary.name)
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
      setIsLoading(false);
    }
    fetch()
  }, [])

  /**
   * インクリメント検索
   */
  const handleKeyUp = (e: any): void => {
    const key = e.key
    if (!(key === "Enter" || key === "Backspace" || key === "Delete")) return
    console.log(`[DEBUG] ${key}キー押下`)
    const value = e.target.value ? e.target.value : ""
    filterPokemons(selectedFilterTypes, value)
  }

  /**
   * 番号順にソート
   */
  const sortById = () => {
    console.log("[DEBUG] 番号順ボタン押下")
    const sorted = [...pokemons].sort((a: Pokemon, b: Pokemon) => {
      return a.id > b.id ? 1 : -1
    })
    setPokemons(sorted)
  }

  /**
   * アイウエオ順にソート
   */
  const sortByJapanese = () => {
    console.log("[DEBUG] アイウエオ順ボタン押下")
    const sorted = [...pokemons].sort((a: Pokemon, b: Pokemon) => {
      return a.name > b.name ? 1 : -1
    })
    setPokemons(sorted)
  }

  /**
   * リセット
   */
  const resetList = () => {
    console.log("[DEBUG] リセットボタン押下")
    setPokemons(fullPokemons)
    setSelectedFilterTypes([])
  }

  /**
   * タイプフィルタ
   */
  const handleClickType = (type: string): void => {
    console.log("[DEBUG] タイプ押下", type)
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
    const species = await api.getSpecies(pokemon.id)
    const names = species.names
    const japaneseName = names.find((v: any) => v.language.name == "ja").name
    return japaneseName
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
    const typeSummaries = await api.getTypeSummaries()
    const types = []
    for (const typeSummary of typeSummaries.results) {
      const typeDetail = await api.getTypeDetail(typeSummary.name)
      const globalTypeNames = typeDetail.names
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
          <div key={i}>
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
        <IconBtn icon={<BsSortNumericDown />} func={sortById}>番号順</IconBtn>
        <IconBtn icon={<BsSortAlphaDown />} func={sortByJapanese}>アイウエオ順</IconBtn>
        <IconBtn icon={<BsStars />} func={resetList}>リセット</IconBtn>
      </Box>

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "Center",
            minHeight: 200,
            p: 0,
            pt: "18%",
            mx: 1,
          }}
        >
          <CircularProgress size="5rem" color="secondary" sx={{ color: "rgba(255, 255, 255, 0.3)", animationDuration: '1000ms', margin: 0 }} />
        </Box>
      )}

      {!isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            p: 0,
            mx: 1,
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
      )}
    </>
  )
}
