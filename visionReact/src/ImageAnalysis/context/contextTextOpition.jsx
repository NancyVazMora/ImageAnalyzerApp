import { createContext, useState } from 'react'

// Este es el que tenemos que consumir
export const TextOptionContext = createContext()

// Este es el que nos provee de acceso al contexto
export function TextOptionProvider ({ children }) {
  const [textOption, setTextOption] = useState("all")

  return (
    <TextOptionContext.Provider value={{
      textOption,
      setTextOption
    }}
    >
      {children}
    </TextOptionContext.Provider>
  )
}