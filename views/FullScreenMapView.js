import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { IndoorAtlas } from 'react-native-indooratlas';
import { WebView } from 'react-native-webview';

const DEFAULT_LATITUDE = 60.1699;
const DEFAULT_LONGITUDE = 24.9384;

const MAP_HTML = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      let map;
      let marker;
      let pendingPosition = null;

      function ensureMap() {
        if (map) return;

        map = L.map('map', {
          zoomControl: true,
          attributionControl: true,
        }).setView([${DEFAULT_LATITUDE}, ${DEFAULT_LONGITUDE}], 18);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 20,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        marker = L.marker([${DEFAULT_LATITUDE}, ${DEFAULT_LONGITUDE}]).addTo(map);

        if (pendingPosition) {
          const [lat, lon] = pendingPosition;
          window.updatePosition(lat, lon);
          pendingPosition = null;
        }
      }

      window.updatePosition = function updatePosition(lat, lon) {
        if (typeof lat !== 'number' || typeof lon !== 'number') return;

        if (!map || !marker) {
          pendingPosition = [lat, lon];
          return;
        }

        const next = [lat, lon];
        marker.setLatLng(next);
        map.panTo(next, { animate: true, duration: 0.35 });
      }

      document.addEventListener('DOMContentLoaded', ensureMap);
    </script>
  </body>
</html>
`;

export default function FullScreenMapView({ iaApiKey, onBack }) {
  const webViewRef = useRef(null);
  const [positioningState, setPositioningState] = useState('stopped');

  useEffect(() => {
    return () => {
      try {
        IndoorAtlas.clearWatch();
      } catch (error) {
        // no-op
      }
    };
  }, []);

  const injectPositionUpdate = (latitude, longitude) => {
    if (!webViewRef.current) return;

    const script = `window.updatePosition(${JSON.stringify(latitude)}, ${JSON.stringify(longitude)}); true;`;
    webViewRef.current.injectJavaScript(script);
  };

  const startPositioning = () => {
    try {
      if (!iaApiKey || iaApiKey.startsWith('REPLACE_')) {
        console.log('[IndoorAtlas] missing API key, cannot start positioning');
        setPositioningState('missing-api-key');
        return;
      }

      IndoorAtlas.initialize({ apiKey: iaApiKey })
        .onStatusChanged((status) => {
          console.log('[IndoorAtlas] map status changed', status);
        })
        .watchPosition((position) => {
          console.log('[IndoorAtlas] position update', position);

          const latitude = position?.coords?.latitude;
          const longitude = position?.coords?.longitude;

          if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            console.log('[IndoorAtlas] position update missing coordinates', position);
            return;
          }

          injectPositionUpdate(latitude, longitude);
        });

      setPositioningState('running');
    } catch (error) {
      console.log('[IndoorAtlas] failed to start positioning', error);
      setPositioningState('error');
    }
  };

  const stopPositioning = () => {
    try {
      IndoorAtlas.clearWatch();
      setPositioningState('stopped');
    } catch (error) {
      console.log('[IndoorAtlas] failed to stop positioning', error);
      setPositioningState('error');
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: MAP_HTML }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => injectPositionUpdate(DEFAULT_LATITUDE, DEFAULT_LONGITUDE)}
      />
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      <View style={styles.controlsContainer}>
        <Pressable style={styles.startButton} onPress={startPositioning}>
          <Text style={styles.controlButtonText}>Start positioning</Text>
        </Pressable>
        <Pressable style={styles.stopButton} onPress={stopPositioning}>
          <Text style={styles.controlButtonText}>Stop positioning</Text>
        </Pressable>
      </View>
      <Text style={styles.positioningStateText}>IndoorAtlas: {positioningState}</Text>
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
  controlsContainer: {
    position: 'absolute',
    right: 16,
    top: 48,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#B91C1C',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  positioningStateText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    color: '#111827',
    backgroundColor: '#FFFFFFDD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    fontWeight: '600',
  },
});
