import { useState, useContext } from "react"
import { ColoredMessage } from "./components/ColoredMessage"
import { CssModules } from "./components/CssModules"
import { StyledJsx } from "./components/StyledJsx"
import { StyledComponents } from "./components/StyledComponents"
import { Emotion } from "./components/Emotion"
import { Card } from "./components/Card"
import { AdminFlagContext } from "./components/providers/AdminFlagProvider"

export const App = () => {
  const [num, setNum] = useState(0)
  const { isAdmin, setIsAdmin } = useContext(AdminFlagContext)
  // admin切り替え
  const onClickSwitch = () => setIsAdmin(!isAdmin)

  // カウントアップ
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
      <button onClick={onClickSwitch}>切り替え</button>
      <Card isAdmin={isAdmin}></Card>
    </>
  )
}
