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

## Project files

- `App.js` – home view + navigation to full-screen map view
- `app.json` – Expo configuration
- `index.js` – app entry point
- `modules/expo-custom-native/` – local custom native module (Kotlin + TS bridge)
- `views/FullScreenMapView.js` – full-screen OpenStreetMap view using `react-native-webview` (no API key)
