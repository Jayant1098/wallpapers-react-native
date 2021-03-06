﻿# This repo contains the source code of a Wallapaper App built using react native and expo

 - _Expo_ is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React.
 ## App features
 - Every time you open the app you get a set of 30 random wallpapers.
 - Wallpapers can be saved on the device. 
 - The share button allow you to share the wallpaper through your desired app.
 - Press the refresh button to get new wallpapers.
 - App uses native rendering to provide buttery smooth 60fps animations.

## How to use this app
 
Make sure you have installed yarn and expo on your system before proceeding.

 1. [Fork this repository](https://github.com/Jayant1098/wallpapers-react-native) or clone it to your local machine.
    `git clone https://github.com/Jayant1098/wallpapers-react-native.git`
 2. Extract the file on local machine and run yarn to install all the required dependencies.
 3. Create a config.js file in the root of the . Follow the config section to setup this file.
 4. Once the file has been setup use `yarn start` to run.  This will open up the expo in your browser.
 5. Install the expo app on your smartphone and scan the QR code on bottom left of the screen to open up the app on your phone

## Setting up config.js

 1. Create a file config.js in the root of the project.
 2.  [Go to](https://unsplash.com/developers) and create an account.
 3. [Create a new app](https://unsplash.com/oauth/applications) and copy the access key and the secret key in your config.js file like so and save the file.

    ` export const config ={
    accessKey: "Paste Your access key here
    ,
    secretKey: "Paste your secret key here"}`
   
## Screenshots
![Screenshot 1](https://drive.google.com/uc?export=view&id=1HLct4Em-CORGo5tvEDJTrIwJRIwRdU1T)
