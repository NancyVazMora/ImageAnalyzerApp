import { createContext, useState } from 'react'

// Este es el que tenemos que consumir
export const UploadStatusContext = createContext()

// Este es el que nos provee de acceso al contexto
export function UploadStatusProvider ({ children }) {
  const [uploadStatus, setUploadStatus] = useState({display:null, status: ""})

  return (
    <UploadStatusContext.Provider value={{
      uploadStatus,
      setUploadStatus
    }}
    >
      {children}
    </UploadStatusContext.Provider>
  )
}