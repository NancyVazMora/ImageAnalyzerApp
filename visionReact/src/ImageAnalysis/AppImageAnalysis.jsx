import { useContext} from 'react'
import "./AppImageAnalizer.css"
import {ImageInfo} from "./infoImage"
import {UploaderApp} from "../uploaderComponent/Uploader"
import {UploadStatusContext} from "./context/contextUploadStatus"
import {TextOptionContext} from "./context/contextTextOpition"
import {useImageAnalizer} from "./customImageAnalizer"


// In this function the information is displayed
export function AppImageAnalizer(){
    const {uploadStatus} = useContext(UploadStatusContext)
    const {textOption} = useContext(TextOptionContext)
    const { imageInfo } = useImageAnalizer(uploadStatus)

    return(
        <main className='analysisSection'>
            <div className='uploadSection'>
                <UploaderApp />
            </div>
            <div className='blackboardAnalysis'>
                {
                    uploadStatus.display != null
                        ?
                        <div className='analysisResult'>
                            <div className='caption' style={{display:textOption == "people" && 'none'}}>
                                <div>
                                    <p> <span>Caption:</span> {imageInfo.Caption.text}</p>
                                    <p><span>Confidence:</span> {imageInfo.Caption.Confidence}</p>
                                </div>
                            </div>
                            <ImageInfo option={textOption} imageInfo={imageInfo}/>
                        </div>
                        :
                        <div className='analysisResultNone'>
                            <p style={{display:uploadStatus.status != "Error" && "none"}}>Error al subir la imagen. Por favor intenta de nuevo.</p>
                        </div>
                    }
                
            </div>
        </main>
    )
}