import * as React from 'react';

import { ExpoCustomNativeViewProps } from './ExpoCustomNative.types';

export default function ExpoCustomNativeView(props: ExpoCustomNativeViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
