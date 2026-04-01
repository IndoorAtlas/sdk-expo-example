import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoCustomNativeViewProps } from './ExpoCustomNative.types';

const NativeView: React.ComponentType<ExpoCustomNativeViewProps> =
  requireNativeView('ExpoCustomNative');

export default function ExpoCustomNativeView(props: ExpoCustomNativeViewProps) {
  return <NativeView {...props} />;
}
