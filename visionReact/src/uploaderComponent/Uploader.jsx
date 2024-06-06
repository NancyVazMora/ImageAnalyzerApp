import "./uploader.css"
import { useState, useContext } from "react"
import {imgUpload} from "./img/img"
import {UploadStatusContext} from "../ImageAnalysis/context/contextUploadStatus"
import {TextOptionContext} from "../ImageAnalysis/context/contextTextOpition"


let API_IMAGE_ANALYZER = 'http://localhost:5001/registrar-archivo'


export function UploaderApp(){
    const {uploadStatus, setUploadStatus} = useContext(UploadStatusContext)
    const {setTextOption} = useContext(TextOptionContext)
    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState("No selected file")
    const [file, setFile] = useState(null);
    const [text, setText] = useState({text:"all", select: 1});

    // File upload function
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    
    // Analyze Image button function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if there is an image selected
        if (!file) {
          alert('Please select an image.');
          return;
        }

        // Create a FormData object and add the image with the name of the selected option
        const formData = new FormData();
        formData.append(text.text, file);

        // Request POST to send image
        try {
          const response = await fetch(API_IMAGE_ANALYZER, {
            method: 'POST',
            body: formData,
            headers: {
              'Access-Control-Allow-Origin': '*',
            }
          });
          const data = await response.json();
        //   console.log(data);
        if(data.status == true){
            console.log("Image uploaded successfully")
            setUploadStatus({display:"result", status: "Success"});
        }
        } catch (error) {
          console.error('Error uploading image:', error);
          setUploadStatus({display:null, status: "Error"});
        }
    };

    // option selected function 
    function typeRequest(n){
        let t = "";
        if(n == 1){
            t = "all"
        } else if (n == 2){
            t = "description"
        } else if (n == 3){
            t = "read"
        } else if (n == 4){
            t = "objects"
        } else if (n == 5){
            t = "people"
        }
        setTextOption(t)
        setText({text: t, select: n})
    }
   
    return(
        <div className="uploadImageSection">
            <p>Analyze the image and obtain:</p>
            <form action=""  onSubmit={handleSubmit} >
                <div className="optionsInfo">
                    <div onClick={() => typeRequest(1)} >
                        <p style={{color: text.select == 1 && "#09090B"}}>All information</p>
                        <div style={{display: text.select != 1 && "none"}} className="line"></div>
                    </div>
                    <div  onClick={() => typeRequest(2)}>
                        <p style={{color: text.select == 2 && "#09090B"}}>Image description </p>
                            <div style={{display: text.select != 2 && "none"}} className="line"></div>
                        </div>
                    <div onClick={() => typeRequest(3)}>
                            <p style={{color: text.select == 3 && "#09090B"}}>Read Text</p>
                            <div style={{display: text.select != 3 && "none"}} className="line"></div>
                    </div>
                    <div  onClick={() => typeRequest(4)}>
                        <p style={{color: text.select == 4 && "#09090B"}}>Objects</p>
                        <div style={{display: text.select != 4 && "none"}} className="line"></div>
                    </div>
                    <div onClick={() => typeRequest(5)}>
                        <p style={{color: text.select == 5 && "#09090B"}}>People</p>
                        <div style={{display: text.select != 5 && "none"}} className="line"></div>
                    </div>
                </div>
                <div onClick={() => document.getElementsByClassName("input-field")[0].click()} id="formImage" >
                    <input type="file" accept="image/*" className="input-field" hidden 
                    onChange={({target:{files}}) => {
                        files[0] && setFileName(files[0].name)
                        if(files){
                            setImage(URL.createObjectURL(files[0]))
                        }
                    }} 
                    onChangeCapture={handleFileChange}
                    />
                    {image ? 
                    <img src={image} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}/>
                    :
                    <>
                    <img src={imgUpload.upload} alt="" className="uploadIcon" />
                    <p>Browse Files to upload</p>
                    </>
                    }
                </div>
                <div className="analizeImageUpload">
                    <div className="uploaded-row">
                        <img src={imgUpload.imgIcon} alt="" />
                        <div className="deleteIcon">
                            {fileName}
                            <div 
                            onClick={() => {setFileName("No selected File")
                            setImage(null)
                            }}><img src={imgUpload.deleteImg} alt="" /></div>
                        </div>
                    </div>
                    <button type="submit" className="submit"><img src={imgUpload.analyzeIcon} alt="" />Analyze image</button>
                </div>
            </form>
        </div>
    )
}