from flask import Flask, request
from flask_cors import CORS
import os
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
import json
import cv2 as cv
import base64


app = Flask(__name__)

CORS(app)

# Enable CORS permissions through any origin (for testing purposes)
CORS(app, resources={
    r"/": {
        "origins": "*"
    }
})

vAPI = "/v1/"

# Use OpenCV to draw the boxes and put it a label 
def imageResult(objectList):

    # Read image
    img = cv.imread("images/submittedImage")

    for element in objectList:
        # Text (Read) option
        if "Line" in element:
            cv.rectangle(img, (element["boundingBox"][0]["x"],element["boundingBox"][0]["y"]), ( element["boundingBox"][2]["x"] , element["boundingBox"][2]["y"] ), (255,0,0), 2)
            # Interleaves the side on which the text is written
            if element["id"] % 2 == 0:
                cv.putText(img, str(element["id"]), (element["boundingBox"][2]["x"],element["boundingBox"][2]["y"]), cv.FONT_HERSHEY_SIMPLEX, 0.7, (255,0,255), 2)
            else:
                cv.putText(img, str(element["id"]), (element["boundingBox"][0]["x"],element["boundingBox"][0]["y"]), cv.FONT_HERSHEY_SIMPLEX, 0.7, (255,0,255), 2)
        # Objects option
        elif "tag" in element:
            cv.rectangle(img, (element["boundingBox"]["x"],element["boundingBox"]["y"]), (element["boundingBox"]["x"] + element["boundingBox"]["w"], element["boundingBox"]["y"] + element["boundingBox"]["h"]), (255,0,0), 5)
            cv.putText(img, element["tag"], (element["boundingBox"]["x"],element["boundingBox"]["y"]), cv.FONT_HERSHEY_SIMPLEX, 1, (255,0,255), 3)
        # People option
        else:
            cv.rectangle(img, (element["boundingBox"]["x"],element["boundingBox"]["y"]), (element["boundingBox"]["x"] + element["boundingBox"]["w"], element["boundingBox"]["y"] + element["boundingBox"]["h"]), (255,0,0), 5)
            cv.putText(img, str(element["id"]), (element["boundingBox"]["x"],element["boundingBox"]["y"]), cv.FONT_HERSHEY_SIMPLEX, 1, (255,0,255), 3)
    # The image is encoded as a jpg file
    ret, buffer = cv.imencode('.jpg', img)
    # Encode image to base64
    data = base64.b64encode(buffer)
    return data


# Delate Image 
def delateImage():
    image = "images/submittedImage"
    os.remove(image)
    print("Imagen delated")


def analisisImagen(visual_features):

    imageInfo = {
        "Caption":{"text": "", "Confidence": 0}, 
        "Dense_Captions": [],
        "Objects": [],
        "ObjectImg": "",
        "tags": [],
        "Read": [],
        "ReadImg": "",
        "People": [],
        "PeopleImg": "",
        }


    # Set the values of your computer vision endpoint and computer vision key
    # as environment variables:
    try:
        endpoint = os.environ["VISION_ENDPOINT"]
        key = os.environ["VISION_KEY"]
    except KeyError:
        print("Missing environment variable 'VISION_ENDPOINT' or 'VISION_KEY'")
        print("Set them before running this sample.")
        exit()

    # Create an Image Analysis client
    client = ImageAnalysisClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(key)
    )

    with open("images/submittedImage", "rb") as f:
        image_data = f.read()

    # Analyze all visual features from an image stream. This will be a synchronously (blocking) call.
    result = client.analyze(
        image_data= image_data,
        visual_features=visual_features,
        smart_crops_aspect_ratios=[0.9, 1.33],
        gender_neutral_caption=True,
        language="en"
    )

    # Print all analysis results to the console
    print("Image analysis results:")

    if result.caption is not None:
        print(" Caption:")
        # Data to send
        imageInfo['Caption'] = { 'text' : result.caption.text, 'Confidence': float(format(result.caption.confidence, '.4f'))}
        # print(f"   '{result.caption.text}', Confidence {result.caption.confidence:.4f}")

    if result.dense_captions is not None:
        print(" Dense Captions:")
        id = 1
        denseList = []
        for caption in result.dense_captions.list:
            denseObject = {"id": id, "text": caption.text, "Confidence":float(format(caption.confidence, '.4f'))}
            denseList.append(denseObject)
            id += 1
            # print(f"   '{caption.text}', {caption.bounding_box}, Confidence: {caption.confidence:.4f}")
        # Data to send
        imageInfo["Dense_Captions"] = denseList


    if result.read is not None:
        print(" Read:")
        id = 1
        readList = []
        readListImg = []
        if result.read['blocks'] != []:
            for line in result.read.blocks[0].lines:
                # Convert to string
                bounding_boxR = str(line.bounding_polygon)
                # Change single quote to double quotes
                bounding_boxR = bounding_boxR.replace("'", '"', 16)
                # Convert string to json
                bounding_boxR = json.loads(bounding_boxR)
                # dic with coordinates for box in the image and label
                readImgObject = {"id": id, "Line": "", "boundingBox": bounding_boxR }
                readListImg.append(readImgObject)
                # JSON to send
                readObject = {"id": id,"Line": line.text}
                readList.append(readObject)
                id += 1
                # print(f"   Line: '{line.text}', Bounding box {line.bounding_polygon}")
                # for word in line.words:
                #     wordObject = {"id": idW, "Word":word.text, "Confidence": float(format(word.confidence, '.4f'))}
                    # print(f"     Word: '{word.text}', Bounding polygon {word.bounding_polygon}, Confidence {word.confidence:.4f}")
            # Data to send
            imageInfo["Read"] = readList
            # Get image with boxes and labels drawn
            dataR = imageResult(readListImg)
            imageInfo['ReadImg'] = dataR.decode().replace("'", '"')


    if result.tags is not None:
        print(" Tags:")
        id = 1
        tagList = []
        for tag in result.tags.list:
            tagObject = {"id": id,"text": tag.name, "Confidence": float(format(tag.confidence, '.4f'))}
            tagList.append(tagObject)
            id += 1
            # print(f"   '{tag.name}', Confidence {tag.confidence:.4f}")
        # Data to send
        imageInfo["tags"] = tagList 

    if result.objects is not None:
        print(" Objects:")
        id = 1
        objectList = []
        objectImgList = []
        for object in result.objects.list:
            # Filter according to confidence
            if object.tags[0].confidence > 0.2:
                # Convert to string
                bounding_boxO = str(object.bounding_box)
                # Change single quote to double quotes
                bounding_boxO = bounding_boxO.replace("'", '"', 8)
                # Convert string to json
                bounding_boxO = json.loads(bounding_boxO)
                # dic with coordinates for box in the image and label
                objectElementImg = {"tag": object.tags[0].name, "boundingBox": bounding_boxO}
                objectImgList.append(objectElementImg)
                # JSON to send
                objectElement = {"id": id,"tag": object.tags[0].name, "Confidence":float(format(object.tags[0].confidence, '.4f'))}
                objectList.append(objectElement)
                id += 1
                # print(f"   '{object.tags[0].name}', {object.bounding_box}, Confidence: {object.tags[0].confidence:.4f}")
        # Data to send
        imageInfo["Objects"] = objectList
        # Get image with boxes and labels drawn
        data = imageResult(objectImgList)
        imageInfo["ObjectImg"] = data.decode().replace("'", '"')

    if result.people is not None:
        print(" People:")
        id = 1
        peopleList = []
        peopleImgList = []
        for person in result.people.list:
            # Filter according to confidence
            if person.confidence > 0.4:
                # Convert to string
                bounding_boxP = str(person.bounding_box)
                # Change single quote to double quotes
                bounding_boxP = bounding_boxP.replace("'", '"', 8)
                # Convert string to json
                bounding_boxP = json.loads(bounding_boxP)
                # dic with coordinates for box in the image and label
                objectPeopleImg = {"id": id, "boundingBox": bounding_boxP}
                peopleImgList.append(objectPeopleImg)
                # JSON to send
                objectPeople = {"id": id, "Confidence": float(format(person.confidence, '.4f'))}
                peopleList.append(objectPeople)
                id += 1
            # print(f"   {person.bounding_box}, Confidence {person.confidence:.4f}")
        # Data to send
        imageInfo['People'] = peopleList
        # Get image with boxes and labels drawn
        dataP = imageResult(peopleImgList)
        imageInfo['PeopleImg'] = dataP.decode().replace("'", '"')

    # print(f" Image height: {result.metadata.height}")
    # print(f" Image width: {result.metadata.width}")
    # print(f" Model version: {result.model_version}")

    # Delete image after being analyzed
    delateImage()

    return  imageInfo


@app.route('/')
def home():
    formResponse = {
        "Caption":{"text": "", "Confidence": 0}, 
        "Dense_Captions": [],
        "Objects": [],
        "ObjectImg": "",
        "tags": [],
        "Read": [],
        "ReadImg": "",
        "People": [],
        "PeopleImg": "",
    }
    return formResponse

# Save image
def imageSaved(image):
  if image:
    # Save the image in a folder called "images"
    # Image saved with name "submittedImage"
    image.save(os.path.join('images', "submittedImage"))  
    print("image saved")
    


# Save image
@app.route('/registrar-archivo',methods=['GET', 'POST'])
def registarArchivo():
    # POST request 
    if request.method == 'POST':
        # option selected
        global requestName
        requestName = ""

        # request sent with image and option selected
        fileList = request.files

        # Options list 
        keys = ["all", "description", "read", "people", "objects"]
        if keys[0] in fileList:
            # all
            imageSaved(fileList[keys[0]])
            requestName = keys[0]
        if keys[1] in fileList:
            # description
            imageSaved(fileList[keys[1]])
            requestName = keys[1]
        if keys[2] in fileList:
            # read
            imageSaved(fileList[keys[2]])
            requestName = keys[2]
        if keys[3] in fileList:
            # people           
            imageSaved(fileList[keys[3]])
            requestName = keys[3]
        if keys[4] in fileList:
            # objects  
            imageSaved(fileList[keys[4]])
            requestName = keys[4]

        return {"status": True}
    
    # GET request 
    if request.method == 'GET':
        # json with analysis result
        imageInfoResult = {}
        # Analysis according to the selected option
        if requestName == "all":
            imageInfoResult = analisisImagen([    
                                VisualFeatures.TAGS,
                                VisualFeatures.OBJECTS,
                                VisualFeatures.CAPTION,
                                VisualFeatures.DENSE_CAPTIONS,
                                VisualFeatures.READ,
                                VisualFeatures.SMART_CROPS,
                                VisualFeatures.PEOPLE,])
        elif requestName == "description":
            imageInfoResult = analisisImagen([VisualFeatures.TAGS,VisualFeatures.DENSE_CAPTIONS, VisualFeatures.CAPTION,])
        elif requestName == "read":
            imageInfoResult = analisisImagen([VisualFeatures.READ, VisualFeatures.CAPTION,])
        elif requestName == "people":
            print(requestName)
            imageInfoResult = analisisImagen([VisualFeatures.PEOPLE, VisualFeatures.CAPTION])
        elif requestName == "objects":
            imageInfoResult = analisisImagen([VisualFeatures.OBJECTS, VisualFeatures.CAPTION,])
        return imageInfoResult

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
