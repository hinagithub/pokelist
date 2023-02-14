/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { PokemonList } from "./components/PokemonList"
import { Search } from "./components/Search"
import { SearchWordProvider } from "./providers/SerchWordProvider"

const style = css({
  background: 'linear-gradient( to bottom,#dad4ec 0%,#f3e7e9 100% )',
})

function App() {
  return (
    <div css={[style]}>
      <SearchWordProvider>
        <Search />
        <PokemonList />
      </SearchWordProvider>
    </div>
  )
}


export default App

