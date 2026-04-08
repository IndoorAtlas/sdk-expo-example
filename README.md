# expo-sdk-example

Minimal React Native app built with Expo with IndoorAtlas-based positioning and a full-screen map view.

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

Native Android/iOS changes require rebuilding the development app.

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

TODO: Verify that everything works on iOS.

## Project files

- `App.js` – home view + map view entry
- `app.json` – Expo configuration
- `index.js` – app entry point
- `views/FullScreenMapView.js` – full-screen OpenStreetMap view using `react-native-webview` (no API key)
