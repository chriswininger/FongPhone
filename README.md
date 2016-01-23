# FongPhone

#### Now Available In App Store
[Android](https://play.google.com/store/apps/details?id=com.fongphone), [ios](https://itunes.apple.com/us/app/fongphone/id1073371447?ls=1&mt=8)

#### Developer Instructions
For those wanting more than an app store purchase, this project is available here, under gpl v2 as source. You may, modify it, build it, and run it on your devices. The instructions below may not be perfect, but I will continue to update them.

#### Requirements
1. nodejs (dev/testing)
2. npm
3. gulp
4. bower
5. cordova
6. appropriate sdk

#### Installation

npm install -g gulp

npm install -g bower

npm install

gulp initialize

cordova plugins add cordova-plugin-crosswalk-webview
cordova plugins add cordova-plugin-splashscreen
cordova plugins add org.apache.cordova.dialogs

#### In Browser Testing

- While intended for use as a mobile app, this can be testing locally in a browser such as Chrome, using the server.js file in [project dir]/server
- Simply run node ./server/server.js
- Open chrome and navigate to http://localhost:3000. Use develper tools to enable mobile emulation in order to interact with the app.
