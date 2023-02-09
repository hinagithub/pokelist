import { useState } from "react"
import { ColoredMessage } from "./components/ColoredMessage"
import { CssModules } from "./components/CssModules"
import { StyledJsx } from "./components/StyledJsx"
import { StyledComponents } from "./components/StyledComponents"
import { Emotion } from "./components/Emotion"

export const App = () => {
  const [num, setNum] = useState(0)

  const onClickButton = () => {
    setNum((num) => num + 1)
  }
  return (
    <>
      <ColoredMessage color="blue">children text.</ColoredMessage>
      <button onClick={onClickButton}>xxx</button>
      <CssModules></CssModules>
      <StyledJsx></StyledJsx>
      <StyledComponents></StyledComponents>
      <Emotion></Emotion>
      <p>{num}</p>
    </>
  )
}
