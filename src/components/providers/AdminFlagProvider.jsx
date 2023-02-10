import { createContext, useState } from "react"
export const AdminFlagContext = createContext({})

export const AdminFlagProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <AdminFlagContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminFlagContext.Provider>
  )
}
