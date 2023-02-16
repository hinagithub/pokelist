/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { PokemonList } from "./components/PokemonList"

const style = css({
  // background: 'linear-gradient( to bottom,#dad4ec 0%,#f3e7e9 100% )',
  background: "transparent",

})

function App() {
  return (
    <div css={[style]}>
      <PokemonList ></PokemonList >
    </div>
  )
}


export default App

