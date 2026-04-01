// Reexport the native module. On web, it will be resolved to ExpoCustomNativeModule.web.ts
// and on native platforms to ExpoCustomNativeModule.ts
export { default } from './src/ExpoCustomNativeModule';
export { default as ExpoCustomNativeView } from './src/ExpoCustomNativeView';
export * from  './src/ExpoCustomNative.types';
