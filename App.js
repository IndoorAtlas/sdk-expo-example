import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import ExpoCustomNativeModule from './modules/expo-custom-native';
import FullScreenMapView from './views/FullScreenMapView';

const nativeGreeting = ExpoCustomNativeModule.hello();

export default function App() {
  const [activeView, setActiveView] = useState('home');

  if (activeView === 'map') {
    return (
      <>
        <FullScreenMapView onBack={() => setActiveView('home')} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo + Custom Android Native Code</Text>
      <Text style={styles.subtitle}>Native hello(): {nativeGreeting}</Text>
      <Pressable
        style={styles.button}
        onPress={() => ExpoCustomNativeModule.setValueAsync(`Tapped at ${new Date().toISOString()}`)}
      >
        <Text style={styles.buttonText}>Call native AsyncFunction</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => setActiveView('map')}>
        <Text style={styles.buttonText}>Open Full Screen Map</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#232323',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
