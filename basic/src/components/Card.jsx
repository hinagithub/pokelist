import { EditButton } from "./EditButton"

const style = {
  width: "400px",
  height: "200px",
  margin: "8px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}

export const Card = () => {
  return (
    <div style={style}>
      <p>global state</p>
      <EditButton />
    </div>
  )
}
