import {PeopleMapping, DescriptionMapping, ReadMapping, ObjectsMapping, DescriptionAllMapping, ObjectAllMapping} from "./cardImageAnalysis"
import {imgUpload } from "../uploaderComponent/img/img"
import "./infoImage.css"

export function ImageInfo({option, imageInfo}){
    let imageSrcPeople;
    let imageSrcObject;
    let imageSrcRead; 

    // Check if an image was received (in each option)
    if(imageInfo.PeopleImg != ""){
        imageSrcPeople = "data:image/jpeg;base64," + imageInfo.PeopleImg;
    } else{
        imageSrcPeople = imgUpload.imageShow;
    } 

    if(imageInfo.ObjectImg != ""){
        imageSrcObject = "data:image/jpeg;base64," + imageInfo.ObjectImg;
    } else{
        imageSrcObject = imgUpload.imageShow;
    }

    if(imageInfo.ReadImg != "" ){
        imageSrcRead = "data:image/jpeg;base64," + imageInfo.ReadImg;
    } else if(imageInfo.ReadImg == "" ){
        imageSrcRead = imgUpload.imageShow;
    }

    // The information is displayed according to the selected option
    if(option == "all"){
        return(
            <div className='allInfoSection'>
                <div className='allInfo'>
                    <div className='titleCardAll'>
                        <p>Number</p>
                        <p>Description</p>
                        <p>Confidence</p>
                    </div>
                    <DescriptionAllMapping dataList={imageInfo.Dense_Captions} />
                    <div className='titleCardAll'>
                        <p>Number</p>
                        <p>Tag</p>
                        <p>Confidence</p>
                    </div>
                    <ObjectAllMapping dataList={imageInfo.tags} />
                    <div className='titleCardAll'>
                        <p>Line text</p>
                        <p>Line number</p>
                    </div>
                    <ReadMapping dataList={imageInfo.Read} />
                    <div className='readImage' style={{display:imageInfo.ReadImg == "" && "none"}}>
                        <img src={imageSrcRead} alt="" />
                    </div>
                    <div  className='allwithImages'>
                        <div>
                            <div className='titleCardAllImg'>
                                <p>Object tag</p>
                                <p>Confidence</p>
                            </div>
                            <ObjectsMapping dataList={imageInfo.Objects} />
                        </div>
                        <div className='imageAllDiv'>
                            <img src={imageSrcObject} alt="" />
                        </div>
                    </div>                
                    <div className='allwithImages'>
                        <div>
                            <div className='titleCardAllImg' >
                                <p>Number of people found</p>
                                <p>Confidence</p>
                            </div>
                            <PeopleMapping dataList={imageInfo.People} />
                        </div>
                        <div className='imageAllDiv'>
                            <img src={imageSrcPeople} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }else if(option == "description"){
        return(
        <div className='descriptionSection'>
            <div className='descrip'>
                <div className='titleCard'>
                    <p>Description</p>
                    <p>Confidence</p>
                </div>
                <div className='scrollData'>
                    <DescriptionMapping dataList={imageInfo.Dense_Captions} />
                 </div>
            </div>
            <div className='descrip'>
                <div className='titleCard'>
                    <p>Tag</p>
                    <p>Confidence</p>
                </div>
                <div className='scrollData'>
                    <DescriptionMapping dataList={imageInfo.tags} />
                </div>
            </div>
        </div>
        )
    } else if(option == "read"){
        return(
            <div>
                <div className='descrip'>
                    <div className='scrollDataR'>
                        <div className='titleCard'>
                            <p>Line text</p>
                            <p>Line number</p>
                        </div>
                        <ReadMapping dataList={imageInfo.Read} />
                        <div className='readImage'>
                            <img src={imageSrcRead} alt="" />
                        </div>
                    </div>
                </div>
            </div>

            
        )
    }else if(option == "objects"){
        return(
            <div className='objectsSection'>
                <div className='descrip'>
                    <div className='titleCard'>
                        <p>Object tag</p>
                        <p>Confidence</p>
                    </div>
                    <div className='scrollData'>
                        <ObjectsMapping dataList={imageInfo.Objects} />
                    </div>
                </div>
                <div className='imageObject'>
                    <img src={imageSrcObject} alt="" />
                </div>
            </div>
           
        )
    }else if(option == "people"){
        return(
            <div>
                 <div className='captionText'>
                    <p> <span>Number of people detected:</span> {imageInfo.People.length}</p>
                </div>
                <div className='peopleImageDiv'><img src={imageSrcPeople} alt="" /></div>
            </div>
           
        )
       
    }

}