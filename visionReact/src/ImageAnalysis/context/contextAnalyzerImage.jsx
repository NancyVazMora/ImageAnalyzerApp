import { createContext, useState } from 'react'

// Este es el que tenemos que consumir
export const ImageInfoContext = createContext()

// Este es el que nos provee de acceso al contexto
export function ImageInfoProvider ({ children }) {
  const [imageInfo, setImageInfo] = useState({ 
    Caption:{
      Confidence: 0,
      text: ""
    },
    Dense_Captions: [],
    Objects: [],
    People: [],
    tags: [],
    Read: [],
    PeopleImg: "",
    ObjectImg: "",
    ReadImg: ""
  })

  return (
    <ImageInfoContext.Provider value={{
      imageInfo,
      setImageInfo
    }}
    >
      {children}
    </ImageInfoContext.Provider>
  )
}