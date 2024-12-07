import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, Alert  } from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
} from "@reactvision/react-viro";
import { Camera, useCameraDevices, useCodeScanner } from "react-native-vision-camera";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "Loading" | "Home" | "Scanner" | "ARScene1" | "ARScene2"
  >("Loading");
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        handleScan(code.value); 
      }
    }
  })
  

  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "back"); // Correctly find the back camera

  useEffect(() => {
    if (currentScreen === "Loading") {
      const timer = setTimeout(() => {
        setCurrentScreen("Home");
      }, 4910);
      return () => clearTimeout(timer);
    }
    const getPermission = async ()=>{
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "This app needs access to your camera",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission Denied, Camera access is required to use this feature");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }
  getPermission();
  
  }, [currentScreen]);

  const handleScan = (data: string) => {
    console.log("Scanned Data:", data); // Log the scanned data
    if (data === "model1") {
      setCurrentScreen("ARScene1"); // Navigate to AR Scene 1
    } else if (data === "scene2") {
      setCurrentScreen("ARScene2"); // Navigate to AR Scene 2
    } else {
      console.warn("Unknown scene: ", data); // Handle unknown scenes
    }
  };

  if (currentScreen === "Loading") {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("./assets/loading_image.png")} // Replace with your image path
          style={styles.loadingImage}
        />
      </View>
    );
  }

  if (currentScreen === "Home") {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.title}>Welcome to the AR App</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentScreen("Scanner")}
        >
          <Text style={styles.buttonText}>Scan for AR Scene 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentScreen("Scanner")}
        >
          <Text style={styles.buttonText}>Scan for AR Scene 2</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentScreen === "Scanner") {
    if (device == null) return <Text>Loading camera...</Text>; // Wait for device to be ready

    return (
      <View style={styles.scannerContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
          // onBarcodeDetected={({ barcodes }) => {
          //   barcodes.forEach((barcode) => {
          //     console.log("Bar Code Scanned: ", barcode.displayValue);
          //     handleScan(barcode.displayValue); // Call handleScan with the scanned data.
          //   });
          // }}
        >
          <View style={styles.overlay}>
            <Text style={styles.scannerText}>Align QR code within frame</Text>
          </View>
        </Camera>
      </View>
    );
  }

  if (currentScreen === "ARScene1" || currentScreen === "ARScene2") {
    return (
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => (
            <ViroARScene>
              <ViroAmbientLight color="#ffffff" intensity={200} />
              <Viro3DObject
                source={require("./assets/model/myModel.gltf")}
                type="GLTF" 
                resources={[require("./assets/model/myModel_0.bin")]}
                scale={[0.5, 0.5, 0.5]}
                position={[-1, 0, -1]}
              />
            </ViroARScene>
          ),
        }}
        style={styles.f1}
      />
    );
  }

  return null; // Fallback if no screen matches
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  scannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  f1: {
    flex: 1,
  },
});
