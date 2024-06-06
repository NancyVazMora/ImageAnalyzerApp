import "./App.css"
import "./font/stylesheet.css"
import {AppImageAnalizer} from "./ImageAnalysis/AppImageAnalysis"
import {UploadStatusProvider} from "./ImageAnalysis/context/contextUploadStatus"
import {TextOptionProvider} from "./ImageAnalysis/context/contextTextOpition"

function App() {

  return (
    <>
      <TextOptionProvider>
        <UploadStatusProvider>
          <div className="head">
            <h1>Image analyzer</h1>
          </div>
          <AppImageAnalizer />
        </UploadStatusProvider>
      </TextOptionProvider>
    </>
  )
}

export default App
