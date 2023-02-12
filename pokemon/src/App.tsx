/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { PokemonList } from "./components/PokemonList"
import { Search } from "./components/Search"

const style = css({
  background: 'linear-gradient( to bottom,#dad4ec 0%,#f3e7e9 100% )',
})

function App() {
  return (
    <div css={[style]}>
      <Search></Search>
      <PokemonList ></PokemonList >
    </div>
  )
}


export default App

