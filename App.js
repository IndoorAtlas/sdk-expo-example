import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import FullScreenMapView from './views/FullScreenMapView';

const DEFAULT_IA_API_KEY = 'f2f120cc-2070-478d-9305-1b36b220f727';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [iaApiKey, setIaApiKey] = useState(DEFAULT_IA_API_KEY);
  const hasApiKey = iaApiKey.trim().length > 0;

  if (activeView === 'map') {
    return (
      <>
        <FullScreenMapView iaApiKey={iaApiKey} onBack={() => setActiveView('home')} />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo + IndoorAtlas Map Demo</Text>
      <Text style={styles.subtitle}>Enter your IndoorAtlas API key before opening the map.</Text>
      <Text style={styles.inputLabel}>IndoorAtlas API key</Text>
      <TextInput
        style={styles.apiKeyInput}
        value={iaApiKey}
        onChangeText={setIaApiKey}
        placeholder="Enter IndoorAtlas API key"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable
        style={[styles.secondaryButton, !hasApiKey && styles.secondaryButtonDisabled]}
        onPress={() => setActiveView('map')}
        disabled={!hasApiKey}
      >
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
    marginBottom: 12,
    textAlign: 'center',
  },
  inputLabel: {
    width: '100%',
    marginBottom: 6,
    fontWeight: '600',
  },
  apiKeyInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  secondaryButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
