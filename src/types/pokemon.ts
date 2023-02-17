export type Pokemon = {
    id: number
    name: string
    url: string
    types: string[]
}


export type PokeAPIType = {
    slot: number
    type: {
        name: string
        url: string
    }
}

export type TypeName = {
    en: string
    ja: string
}