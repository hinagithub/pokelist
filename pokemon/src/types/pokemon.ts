
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

