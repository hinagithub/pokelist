import axios from 'axios'

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon'
const SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species'
const TYPE_URL = 'https://pokeapi.co/api/v2/type'

// APIの負荷軽減のためのスリープ関数
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  /**
   * ポケモン一覧取得
   */
  getPokemonSumarries: async (limit: number): Promise<any> => {
    const res = await axios.get(`${POKEMON_URL}?limit=${limit}`)
    return res.data
  },

  /**
   * ポケモン詳細取得（0.5秒のスリープ付き）
   */
  getPokemonDetail: async (pokemonName: string): Promise<any> => {
    await sleep(100) // 0.1秒待機
    const res = await axios.get(`${POKEMON_URL}/${pokemonName}`)
    return res.data
  },

  /**
   * ポケモン種族設定取得（0.1秒のスリープ付き）
   */
  getSpecies: async (id: number | string): Promise<any> => {
    await sleep(100) // 0.1秒待機
    const res = await axios.get(`${SPECIES_URL}/${id}`)
    return res.data
  },

  /**
   * タイプ一覧取得
   */
  getTypeSummaries: async (): Promise<any> => {
    const res = await axios.get(TYPE_URL)
    return res.data
  },

  /**
   * タイプの詳細を取得　(英語名->日本語名の翻訳に使用する)
   */
  getTypeDetail: async (name: string): Promise<any> => {
    const res = await axios.get(`${TYPE_URL}/${name}`)
    return res.data
  },
}
