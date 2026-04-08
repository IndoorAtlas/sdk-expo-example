import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Asset } from 'expo-asset';
import { IndoorAtlas } from 'react-native-indooratlas';
import { WebView } from 'react-native-webview';

const DEFAULT_LATITUDE = 60.1699;
const DEFAULT_LONGITUDE = 24.9384;
const MAP_HTML_URI = Asset.fromModule(require('./map.html')).uri;

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

  const clearFloorPlanOverlay = () => {
    if (!webViewRef.current) return;

    webViewRef.current.injectJavaScript('window.clearFloorPlanOverlay(); true;');
  };

  const injectFloorPlanOverlay = (url, topLeft, topRight, bottomLeft, bitmapWidth, bitmapHeight) => {
    if (!webViewRef.current) return;

    const script = `window.setFloorPlanOverlay(${JSON.stringify(url)}, ${JSON.stringify(topLeft.latitude)}, ${JSON.stringify(topLeft.longitude)}, ${JSON.stringify(topRight.latitude)}, ${JSON.stringify(topRight.longitude)}, ${JSON.stringify(bottomLeft.latitude)}, ${JSON.stringify(bottomLeft.longitude)}, ${JSON.stringify(bitmapWidth)}, ${JSON.stringify(bitmapHeight)}); true;`;
    webViewRef.current.injectJavaScript(script);
  };

  const parseCorner = (corner) => {
    if (Array.isArray(corner) && corner.length >= 2) {
      // IndoorAtlas corner array format is [longitude, latitude]
      return { longitude: Number(corner[0]), latitude: Number(corner[1]) };
    }

    if (corner && typeof corner === 'object') {
      const latitude = Number(corner.latitude ?? corner.lat);
      const longitude = Number(corner.longitude ?? corner.lng ?? corner.lon);
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return { latitude, longitude };
      }
    }

    return null;
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
          console.log('[IndoorAtlas] map status changed', JSON.stringify(status));
        })
        .watchPosition((position) => {
          console.log('[IndoorAtlas] position update', JSON.stringify(position));

          const latitude = position?.coords?.latitude;
          const longitude = position?.coords?.longitude;

          if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            console.log('[IndoorAtlas] position update missing coordinates', position);
            return;
          }

          injectPositionUpdate(latitude, longitude);
        })
        .watchFloorPlan((floorPlan) => {
          console.log('[IndoorAtlas] floor plan event', JSON.stringify(floorPlan));

          if (!floorPlan || !floorPlan.url) {
            clearFloorPlanOverlay();
            return;
          }

          const topLeft = parseCorner(floorPlan.topLeft);
          const topRight = parseCorner(floorPlan.topRight);
          const bottomLeft = parseCorner(floorPlan.bottomLeft);

          if (!topLeft || !topRight || !bottomLeft) {
            console.log('[IndoorAtlas] floor plan overlay skipped: missing rotated corner coordinates', floorPlan);
            clearFloorPlanOverlay();
            return;
          }

          injectFloorPlanOverlay(
            floorPlan.url,
            topLeft,
            topRight,
            bottomLeft,
            Number(floorPlan.bitmapWidth),
            Number(floorPlan.bitmapHeight)
          );
        })
        .watchVenue((venue) => {
          console.log('[IndoorAtlas] venue event', JSON.stringify(venue));
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
        source={{ uri: MAP_HTML_URI }}
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
