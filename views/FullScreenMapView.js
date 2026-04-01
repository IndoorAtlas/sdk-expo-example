import { StyleSheet, View, Pressable, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const DEFAULT_LATITUDE = 60.1699;
const DEFAULT_LONGITUDE = 24.9384;
const BBOX_DELTA = 0.08;

const bbox = [
  DEFAULT_LONGITUDE - BBOX_DELTA,
  DEFAULT_LATITUDE - BBOX_DELTA,
  DEFAULT_LONGITUDE + BBOX_DELTA,
  DEFAULT_LATITUDE + BBOX_DELTA,
].join(',');

const OSM_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${DEFAULT_LATITUDE},${DEFAULT_LONGITUDE}`;

export default function FullScreenMapView({ onBack }) {
  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        source={{ uri: OSM_EMBED_URL }}
        javaScriptEnabled
        domStorageEnabled
      />
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: '#111827DD',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
