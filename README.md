# expo-sdk-example

Minimal React Native app built with Expo, including a local custom native Android module.

## Requirements

- Node.js 18+
- Android Studio emulator **or** physical Android device
- Android SDK configured on your machine

## Run (JavaScript only)

1. Install dependencies (already done during project creation):

   `npm install`

2. Start Expo for Android:

   `npm run android`

If you don't have an emulator running yet, start one from Android Studio first.

## Run with custom native Android code

Because this app includes native Android code, use a development build (not Expo Go):

1. Generate native projects when needed:

   `npm run prebuild -- --platform android`

2. Build and run Android app:

   `npm run run:android`

Native code changes in `modules/expo-custom-native/android/` require rebuilding the app.

## IndoorAtlas integration

IndoorAtlas has been added to the Android native project using the official React Native instructions adapted to this Expo prebuild setup.

### What was added

- `react-native-indooratlas`
- `@remobile/react-native-cordova`
- Android module linking in `android/settings.gradle`
- IndoorAtlas package registration in `android/app/src/main/java/com/jussimattas/exposdkexample/MainApplication.kt`
- IndoorAtlas Maven repository in `android/build.gradle`
- Required Android permissions in `android/app/src/main/AndroidManifest.xml`

### API key setup

Set your IndoorAtlas API key in `App.js`:

- `IA_API_KEY = 'REPLACE_WITH_INDOORATLAS_API_KEY'`

You can create API keys at https://app.indooratlas.com/apps.

### iOS note

An `ios/` native folder has been generated and IndoorAtlas pod entries were added to `ios/Podfile`:

- `RCTCordova`
- `RCTIndoorAtlas`

On macOS, run CocoaPods install before building iOS.

## Project files

- `App.js` – home view + map view + IndoorAtlas initialization button
- `app.json` – Expo configuration
- `index.js` – app entry point
- `modules/expo-custom-native/` – local custom native module (Kotlin + TS bridge)
- `views/FullScreenMapView.js` – full-screen OpenStreetMap view using `react-native-webview` (no API key)
