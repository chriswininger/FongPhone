# FongPhone

This is a special branch, containing the Fong Phone that you know and love, but adapted to be a standalone free web app.

This is going to be a springboard to hopefully dust this project off and eventually convert it to something a bit more
modern.

You can ignore everything below about, gulp, gradle etc... The ./www folder contains both the application code and coppies
of the last known working versions of all the required dependencies.

To run locally just execute `node ./server/server.js`. This should work in just about any version of node as it's super
simple node. I'm presently running it in version v24.14.0.

This branch is currently being deployed to Netlify and is available at https://fongphone-app.netlify.app/#/.

## Desktop Controls

Fongs can be clicked and dragged with a mouse just like touch on mobile.

To resize a fong (which controls volume), click the font, then use the scroll wheel, or pinch on a trackpad. Two finger
scroll also works on MacBook.

## Archive

Most of what follows is out of date. I'm leaving it until I can finish getting this up to date

#### Now Available In App Store
[Android](https://play.google.com/store/apps/details?id=com.fongphone), [ios](https://itunes.apple.com/us/app/fongphone/id1073371447?ls=1&mt=8)

### Looking for Fong Tron

It lives on the branch caw/galleryhop/main of this repo

#### Developer Instructions
For those wanting more than an app store purchase, this project is available here, under gpl v2 as source. You may, modify it, build it, and run it on your devices. The instructions below may not be perfect, but I will continue to update them.

#### Requirements
1. nodejs (dev/testing)
2. npm (lts/hydrogen)
3. Java (1.8 oracle)
5. gradle
4. gulp
5. bower
6. cordova
7. appropriate sdk

#### Installation

npm install -g gulp

npm install -g bower

npm install -g cordova

npm install

gulp initialize

cordova plugins add cordova-plugin-crosswalk-webview
cordova plugins add cordova-plugin-splashscreen
cordova plugins add org.apache.cordova.dialogs

#### In Browser Testing

- While intended for use as a mobile app, this can be testing locally in a browser such as Chrome, using the server.js file in [project dir]/server
- Simply run node ./server/server.js
- Open chrome and navigate to http://localhost:3000. Use develper tools to enable mobile emulation in order to interact with the app.

### Cordova Build

- Install corova cli tools: `npm install -g cordova`

- To **test on emulator** run `cordova run --emulator`
	- This assumes you have cordova and android sdk configured, if so an Android emulator will be launched (https://cordova.apache.org/docs/en/latest/guide/platforms/android/).

- To **test on phone** run: `cordova run --device`

- To **build for production** run:

```
cordova build android --release -- --keystore="/home/chris/key_stores/android_release_key_Store.keystore" --alias=android_release_key_store --storePassword={storePassword} --password={keyPassword-Same-As-Store}
```

### NOTES:
* https://stackoverflow.com/questions/24978166/unable-to-export-signed-apk-in-android-studio

* Change password for keystore file: ` keytool -storepasswd -alias android_release_key_store -keystore ~/key_stores/android_release_key_Store.keystore`

* Testing key store: `keytool -list -v -alias android_release_key_store -keystore ~/key_stores/android_release_key_Store.keystore`



/v1/

/v2/


/api/versions

{
 currentVersion: 'v1'
 supperotedVersion: ['v1', 'v2]
}
