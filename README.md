# ImageAnalyzerApp 
Fullstack project to demonstrate usage of azure computer vision from Cognitive Services

# Installation to backend
- pip install Flask
- pip install Flask-Cors
- pip install azure-ai-vision-imageanalysis
- pip install opencv-python

# Visuals
In the Example folder there are images of the application.

# General conformation of the project
There are three folders in ImageAnalyzerApp:
- Example: Has an example of JSON to send as a response to the server with the analysis of the image that was uploaded
- visionReact: Has the web application in which the area to load the image is located and where the image analysis information is displayed. It is a react project created with vite (Project frontend).
- Server: It has a python script that is the server that will be in charge of making the connection process with Azure as well as sending the information (Project backend).

# Usage
