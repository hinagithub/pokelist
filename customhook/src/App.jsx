import { useFetchPokemons } from "./hooks/useFetchPokemons"

export const App = () => {
  const { pokemonList, isLoading, isError, onClickFetchPokemon } =
    useFetchPokemons()

  return (
    <div>
      <button onClick={onClickFetchPokemon}>ポケモン取得</button>
      {isError && <p style={{ color: "red" }}>エラー発生</p>}
      {isLoading ? (
        <p>データ取得中</p>
      ) : (
        pokemonList.map((poke) => (
          <p key={poke.name}>
            {poke.name}: {poke.url}
          </p>
        ))
      )}
    </div>
  )
}
