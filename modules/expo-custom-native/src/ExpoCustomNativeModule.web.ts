import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoCustomNative.types';

type ExpoCustomNativeModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoCustomNativeModule extends NativeModule<ExpoCustomNativeModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoCustomNativeModule, 'ExpoCustomNativeModule');
