import { useState, useEffect } from 'react'

// Address to which the GET request will be made
let API_IMAGE_ANALYZER = 'http://localhost:5001/registrar-archivo'

// Custom Hook
// Place where the image analysis information will be obtained
export function useImageAnalizer(state){
    const [ imageInfo, setImageInfo] = useState({ 
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

    const imageAnalizerElements = () =>{
        // To make the GET request for the information after uploading the image, not when loading the page
        if(state.status != ""){
            fetch(API_IMAGE_ANALYZER, {method: 'GET'})
            .then(response => response.json())
            .then(response => {
              console.log(response)
              setImageInfo(response)
            })
            .catch(err => console.error(err));
        }
    }

    // The function will be executed every time the "state" changes
    useEffect(() => {
        imageAnalizerElements()
    }, [state]);

    return { imageInfo } 
   
}

