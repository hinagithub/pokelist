import { FC, useState, useEffect, useRef } from 'react'
import { api } from '../api/pokemon'
import { Pokemon, PokeAPIType, TypeName } from '../types/pokemon'
import { ItemCard } from './ItemCard'
import { IconBtn } from './IconBtn'
import { Box, Button, CircularProgress } from '@mui/material'
import { BsSortAlphaDown, BsSortNumericDown, BsStars } from 'react-icons/bs'
import { Grid } from '@mui/material'
import { Search } from './Search'

export const PokemonList: FC<any> = () => {
  // ローディング（最初の1匹目が取得されるまで）
  const [isLoading, setIsLoading] = useState(true)
  // 全ポケモン一覧
  const [fullPokemons, setFullPokemons] = useState<Pokemon[]>([])
  // 表示中のポケモン一覧
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  // 全タイプ一覧
  const [masterTypeNames, setMasterTypeNames] = useState<TypeName[]>([])
  // 選択中のタイプ一覧
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<string[]>([])
  // 入力されている検索ワード
  const [searchWord, setSearchWord] = useState<string>('')
  // 読み込み進捗
  const [loadingProgress, setLoadingProgress] = useState<{current: number, total: number}>({current: 0, total: 151})
  
  // 現在のソート状態を管理
  const [currentSortType, setCurrentSortType] = useState<'none' | 'id' | 'name'>('none')
  
  // 現在のフィルタ状態をrefで管理（非同期処理での参照用）
  const currentFiltersRef = useRef({
    selectedTypes: selectedFilterTypes,
    searchWord: searchWord,
    sortType: currentSortType
  })
  
  // フィルタ状態が変更されたらrefを更新
  useEffect(() => {
    currentFiltersRef.current = {
      selectedTypes: selectedFilterTypes,
      searchWord: searchWord,
      sortType: currentSortType
    }
  }, [selectedFilterTypes, searchWord, currentSortType])

  useEffect(() => {
    const fetchPokemonsSequentially = async () => {
      // まずタイプ一覧を取得
      const masterTypeNames = await getTypeNames()
      setMasterTypeNames(masterTypeNames)
      
      // ポケモン一覧の基本情報を取得
      const data = await api.getPokemonSumarries(151)
      const pokemonSummary = data.results
      
      // 順次ポケモンを取得して表示
      for (let i = 0; i < pokemonSummary.length; i++) {
        const summary = pokemonSummary[i]
        
        try {
          const pokemon = await api.getPokemonDetail(summary.name)
          const name = await getName(pokemon)
          const url = getImageUrl(pokemon)
          const types = getTypes(pokemon, masterTypeNames)
          
          const newPokemon: Pokemon = {
            id: pokemon.id,
            name,
            url,
            types,
          }
          
          // 1匹ずつ配列に追加
          setFullPokemons(prev => {
            // 重複チェック：既に同じIDのポケモンが存在するかチェック
            const alreadyExists = prev.some(existingPokemon => existingPokemon.id === newPokemon.id)
            if (alreadyExists) {
              return prev // 既に存在する場合は追加しない
            }
            
            const updated = [...prev, newPokemon]
            // 現在のフィルタ条件に合致するかチェック
            const shouldShowPokemon = checkPokemonMatchesCurrentFilter(newPokemon)
            if (shouldShowPokemon) {
              setPokemons(prevPokemons => {
                // 表示用リストでも重複チェック
                const alreadyInDisplay = prevPokemons.some(p => p.id === newPokemon.id)
                if (!alreadyInDisplay) {
                  const newList = [...prevPokemons, newPokemon]
                  // 現在のソート状態を適用
                  return applySortToPokemonArray(newList, currentFiltersRef.current.sortType)
                }
                return prevPokemons
              })
            }
            return updated
          })
          setLoadingProgress({current: i + 1, total: pokemonSummary.length})
          
          // 最初の1匹が取得できたらローディング画面を終了
          if (i === 0) {
            setIsLoading(false)
          }
        } catch (error) {
          console.error(`ポケモン ${summary.name} の取得に失敗:`, error)
          setLoadingProgress({current: i + 1, total: pokemonSummary.length})
        }
      }
    }
    
    fetchPokemonsSequentially()
  }, [])

  /**
   * 配列にソートを適用
   */
  const applySortToPokemonArray = (pokemonArray: Pokemon[], sortType: 'none' | 'id' | 'name'): Pokemon[] => {
    if (sortType === 'none') return pokemonArray
    
    return [...pokemonArray].sort((a: Pokemon, b: Pokemon) => {
      if (sortType === 'id') {
        return a.id - b.id
      } else if (sortType === 'name') {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }

  /**
   * ポケモンが現在のフィルタ条件に合致するかチェック
   */
  const checkPokemonMatchesCurrentFilter = (pokemon: Pokemon): boolean => {
    const { selectedTypes, searchWord } = currentFiltersRef.current
    
    // 検索文字のチェック
    if (searchWord && !pokemon.name.includes(searchWord)) {
      return false
    }
    
    // タイプフィルタのチェック
    if (selectedTypes.length > 0) {
      let typeMatches = false
      for (const type of pokemon.types) {
        if (selectedTypes.includes(type)) {
          typeMatches = true
          break
        }
      }
      if (!typeMatches) {
        return false
      }
    }
    
    return true
  }

  /**
   * インクリメント検索
   */
  const handleKeyUp = (e: any): void => {
    const key = e.key
    if (!(key === 'Enter' || key === 'Backspace' || key === 'Delete')) return
    console.log(`[DEBUG] ${key}キー押下`)
    const value = e.target.value ? e.target.value : ''
    filterPokemons(selectedFilterTypes, value)
  }

  /**
   * 番号順にソート
   */
  const sortById = () => {
    console.log('[DEBUG] 番号順ボタン押下')
    setCurrentSortType('id')
    const sorted = applySortToPokemonArray(pokemons, 'id')
    setPokemons(sorted)
  }

  /**
   * アイウエオ順にソート
   */
  const sortByJapanese = () => {
    console.log('[DEBUG] アイウエオ順ボタン押下')
    setCurrentSortType('name')
    const sorted = applySortToPokemonArray(pokemons, 'name')
    setPokemons(sorted)
  }

  /**
   * リセット
   */
  const resetList = () => {
    console.log('[DEBUG] リセットボタン押下')
    setCurrentSortType('none')
    setPokemons(fullPokemons)
    setSelectedFilterTypes([])
  }

  /**
   * タイプフィルタ
   */
  const handleClickType = (type: string): void => {
    console.log('[DEBUG] タイプ押下', type)
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
  const filterPokemons = (selectedTypes: string[], word: string = '') => {
    // タイプ・検索文字が設定されていなければ全ポケモンを設定
    if (selectedTypes.length === 0 && !word) {
      const sortedPokemons = applySortToPokemonArray(fullPokemons, currentSortType)
      setPokemons(sortedPokemons)
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

    // フィルタ後にソートを適用
    const sortedFiltered = applySortToPokemonArray(filtered, currentSortType)
    setPokemons(sortedFiltered)
  }

  /**
   * ポケモン画像URL取得
   */
  const getImageUrl = (pokemon: any): string => {
    return pokemon.sprites.other['official-artwork'].front_default
  }

  /**
   * ポケモンの名前を日本語に変換
   */
  const getName = async (pokemon: any): Promise<string> => {
    const species = await api.getSpecies(pokemon.id)
    const names = species.names
    const japaneseName = names.find((v: any) => v.language.name == 'ja').name
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
        (n: { language: { name: string } }) => n.language.name === 'en',
      )?.name
      const ja = globalTypeNames.find(
        (n: { language: { name: string } }) => n.language.name === 'ja',
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
      <Grid container direction="row" justifyContent="center" alignItems="center">
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
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          p: 0,
          pb: 2,
          mx: 10,
          backgroundColor: 'transparent',
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
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          p: 0,
          pb: 2,
          mx: 10,
          backgroundColor: 'transparent',
        }}
      >
        <IconBtn icon={<BsSortNumericDown />} func={sortById}>
          番号順
        </IconBtn>
        <IconBtn icon={<BsSortAlphaDown />} func={sortByJapanese}>
          アイウエオ順
        </IconBtn>
        <IconBtn icon={<BsStars />} func={resetList}>
          リセット
        </IconBtn>
      </Box>

      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'Center',
            minHeight: 200,
            p: 0,
            pt: '18%',
            mx: 1,
          }}
        >
          <CircularProgress
            size="5rem"
            color="secondary"
            sx={{
              color: 'rgba(255, 255, 255, 0.3)',
              animationDuration: '1000ms',
              margin: 0,
            }}
          />
        </Box>
      )}

      {!isLoading && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              p: 0,
              mx: 1,
            }}
          >
            {pokemons.map((pokemon) => (
              <div style={{ margin: 10, padding: 10 }} key={pokemon.id}>
                <ItemCard
                  id={pokemon.id}
                  name={pokemon.name}
                  url={pokemon.url}
                  types={pokemon.types}
                ></ItemCard>
              </div>
            ))}
          </Box>
          
          {/* 読み込み進捗表示（全て読み込み完了するまで） */}
          {loadingProgress.current < loadingProgress.total && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                flexDirection: 'column',
              }}
            >
              <CircularProgress 
                size={30} 
                color="secondary" 
                sx={{ mb: 1, opacity: 0.7 }}
              />
              <div style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                ポケモンを読み込み中... ({loadingProgress.current}/{loadingProgress.total})
              </div>
            </Box>
          )}
        </>
      )}
    </>
  )
}
