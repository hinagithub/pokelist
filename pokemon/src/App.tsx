import { PokemonList } from "./components/PokemonList"
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const style = css({
  background: 'linear-gradient( to bottom,#dad4ec 0%,#f3e7e9 100% )',
})

function App() {
  return (
    <div css={[style]}>
      < PokemonList > test</PokemonList >
    </div>
  )
}


export default App

