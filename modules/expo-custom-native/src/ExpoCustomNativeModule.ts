import { NativeModule, requireNativeModule } from 'expo';

import { ExpoCustomNativeModuleEvents } from './ExpoCustomNative.types';

declare class ExpoCustomNativeModule extends NativeModule<ExpoCustomNativeModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoCustomNativeModule>('ExpoCustomNative');
