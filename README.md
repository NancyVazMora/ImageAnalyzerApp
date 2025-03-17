# ImageAnalyzerApp 
Fullstack project to demonstrate usage of azure computer vision from Cognitive Services

![alt text](https://github.com/NancyVazMora/ImageAnalyzerApp/blob/main/Example/7.png?raw=true)


## Installation to backend
- pip install Flask
- pip install Flask-Cors
- pip install azure-ai-vision-imageanalysis
- pip install opencv-python

## General conformation of the project
There are three folders in ImageAnalyzerApp:
- **Example:** Has an example of JSON to send as a response to the server with the analysis of the image that was uploaded
- **visionReact:** Has the web application in which the area to load the image is located and where the image analysis information is displayed. It is a react project created with vite (Project frontend).
- **Server:** It has a python script that is the server that will be in charge of making the connection process with Azure as well as sending the information (Project backend).

## Visuals
In the Example folder there are images of the application.

## Execution

To run the backend you have to run the script cognitiveServer.py (python3 cognitiveServer.py). It is important before running the python script you run the commands with your Azure credentials (key and endpoint):
- export VISION_KEY=<your_key>
- export VISION_ENDPOINT=<your_endpoint>

There are 2 ways to run the frontend:
- **Option 1:**  Run in production with the dist folder (it is the built project) on a server.
- **Option 2:** Run in developer mode with from the visionReact folder using the command "npm run dev"

## Usage
Once the backend and frontend have been executed, enter the url where the web app is. In the web interface, select what information you want to obtain from the image, load the image and click on the Analyze Image button to obtain the data.
