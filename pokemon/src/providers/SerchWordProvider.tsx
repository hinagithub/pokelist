import { createContext, useState, type Dispatch, } from "react";

const SearchWordType = {
    searchWord: "",
    setSearchWord: (() => undefined) as Dispatch<any>,
}
export const SearchWordContext = createContext(SearchWordType)

export const SearchWordProvider = (props: any) => {
    const { children } = props
    const [searchWord, setSearchWord] = useState("")
    return (
        <SearchWordContext.Provider value={{ searchWord, setSearchWord }}>
            {children}
        </SearchWordContext.Provider>
    )
}