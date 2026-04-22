# expo-sdk-example

Minimal [Expo](https://docs.expo.dev/) application showcasing IndoorAtlas positioning using the [IndoorAtlas React Native plugin](https://github.com/IndoorAtlas/cordova-plugin/tree/react-native).

## Requirements

Detailed requirements TBA. Requires at least NodeJS 18+. Note that running proper IndoorAtlas positioning requieres a physical device.

## Running development build

Install dependencies with `npm install`. Run on Android with `npm run android`. On iOS, run `pod install` in the `ios` directory and run `npm run ios`. To run on a physical iPhone, configure code signing in XCode and run `npm run ios -- --device`.

