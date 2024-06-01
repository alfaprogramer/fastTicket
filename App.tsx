import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { request, PERMISSIONS } from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedText, setScannedText] = useState<string | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      const status = await request(PERMISSIONS.ANDROID.CAMERA);
      setHasPermission(status === 'granted');
    };

    getCameraPermission();
  }, []);

  const handleBarCodeScanned = (e: any) => {
    setScannedText(e.data);
    setIsCameraOpen(false);
  };

  const openCamera = () => {
    if (hasPermission) {
      setIsCameraOpen(true);
    } else {
      Alert.alert('Camera permission is not granted');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isCameraOpen ? (
        <QRCodeScanner
          onRead={handleBarCodeScanned}
          flashMode={RNCamera.Constants.FlashMode.off}
          topContent={
            <Text style={styles.centerText}>
              Scan the QR Code
            </Text>
          }
          bottomContent={
            <Button title="Close Camera" onPress={() => setIsCameraOpen(false)} />
          }
        />
      ) : (
        <View style={styles.centered}>
          {scannedText ? (
            <Text style={styles.scannedText}>{scannedText}</Text>
          ) : (
            <Button title="From" onPress={openCamera} color="yellow" />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
