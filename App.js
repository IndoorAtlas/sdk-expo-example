import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import FullScreenMapView from './views/FullScreenMapView';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [iaApiKey, setIaApiKey] = useState('');
  const normalizedApiKey = iaApiKey.trim();
  const hasApiKey = normalizedApiKey.length > 0;
  const hasValidApiKeyFormat = UUID_REGEX.test(normalizedApiKey);

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
        style={[styles.apiKeyInput, hasApiKey && !hasValidApiKeyFormat && styles.apiKeyInputInvalid]}
        value={iaApiKey}
        onChangeText={setIaApiKey}
        placeholder="Enter IndoorAtlas API key"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {hasApiKey && !hasValidApiKeyFormat && (
        <Text style={styles.inputErrorText}>API key must be a valid UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).</Text>
      )}
      <Pressable
        style={[styles.secondaryButton, !hasValidApiKeyFormat && styles.secondaryButtonDisabled]}
        onPress={() => setActiveView('map')}
        disabled={!hasValidApiKeyFormat}
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
  apiKeyInputInvalid: {
    borderColor: '#DC2626',
  },
  inputErrorText: {
    width: '100%',
    color: '#DC2626',
    marginTop: -10,
    marginBottom: 12,
    fontSize: 12,
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
