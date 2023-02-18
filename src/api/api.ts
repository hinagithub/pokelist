import axios from "axios";

const SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species'
export const api = {

    /**
     * ポケモン一覧取得
     */
    getPokemonSumarries: async (): Promise<any> => {
        const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=30")
        return res.data
    },

    /**
     * 
     */
    getPokemonDetail: async (pokemonName: string): Promise<any> => {
        const res = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        )
        return res.data
    },

    /**
     * ポケモン種族設定取得 (英語名->日本語名の翻訳に使用する)
     */
    getSpecies: async (id: number | string): Promise<any> => {
        const res = await axios.get(`${SPECIES_URL}/${id}`)
        return res.data
    },

    /**
     * タイプ一覧取得
     */
    getTypeSummaries: async (): Promise<any> => {
        const res = await axios.get("https://pokeapi.co/api/v2/type")
        return res.data
    },

    /**
     * タイプの詳細を取得　(英語名->日本語名の翻訳に使用する)
     */
    getTypeDetail: async (name: string): Promise<any> => {
        const res = await axios.get(
            "https://pokeapi.co/api/v2/type/" + name
        )
        return res.data
    }
}