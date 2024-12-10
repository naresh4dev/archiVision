import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform, Alert  } from "react-native";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroNode, ViroARImageMarker, ViroARTrackingTargets,
  ViroBox,
  ViroARPlaneSelector,
  ViroDirectionalLight
} from "@reactvision/react-viro";
import { Camera, useCameraDevices, useCodeScanner } from "react-native-vision-camera";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("Loading");
  const [trackingTarget, setTrackingTarget] = useState("paperPlane");
  const [modelPosition, setModelPosition] = useState([0, -5, -10]);
  const [modelScale, setModelScale] = useState([0.01,0.01,0.01]);
  const [modelRotation,setModelRotation] = useState([0.01,0.01,0.01]);
  const [isModelVisible, setIsModelVisible] = useState(true);
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        handleScan(code.value); 
      }
    }
  })
  
  ViroARTrackingTargets.createTargets({
    "paperPlane": {
      source: require("./assets/plane.jpeg"), // Add your marker image
      orientation: "Up",
      physicalWidth: 1.3,

       // Adjust the width in meters
    },
    floorPlane:{
      source:require("./assets/plane2.jpeg"),
      orientation: "Up",
      physicalWidth: 0.2,
    }
  });
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
  const handleTouch = (position) => {
    console.log(position);
    
    setModelPosition(position);
      
  };

  const handleScan = (data) => {
    console.log("Scanned Data:", data); // Log the scanned data
    if (data === "model1") {
      setCurrentScreen("ARScene1"); // Navigate to AR Scene 1
    } else if (data === "model2") {
      setCurrentScreen("ARScene2"); // Navigate to AR Scene 2
    } else if (data == "model3") {
      setCurrentScreen("ARScene3");
    } else  {
      console.warn("Unknown scene: ", data); // Handle unknown scenes
    }
  };
  const handleAnchorFound = (opt)=>{
    console.log("found")
    console.log("Position:", opt.position);
  console.log("Scale:", opt.scale);
  console.log("Rotation:", opt.rotation);
    setModelPosition(opt.position);
    setModelScale(opt.scale);
    setModelRotation(opt.rotation);
  }

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
          <Text style={styles.buttonText}>Scan QR Code</Text>
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

  if (currentScreen === "ARScene1") {
    return (
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => (
            <ViroARScene >
              <ViroNode  style={styles.f1} height={2}>
              <ViroAmbientLight color="#ffffff" intensity={600} />
              {/* <ViroARPlaneSelector onPlaneSelected={(anchor) => handleTouch(anchor.position)}> */}
              <Viro3DObject
                source={require("./assets/model/11MODEL.gltf")}
                type="GLTF" 
                scale={[0.12, 0.12, 0.12]}
                position={[0,0,-2]}
                resources={[require("./assets/model/11MODEL_0.bin"),
                  require("./assets/model/textures/image_0.png"),
                  require("./assets/model/textures/image_1.png"),
                  require("./assets/model/textures/image_2.png"),
                  require("./assets/model/textures/image_3.png"),
                  require("./assets/model/textures/image_4.png"),
                  require("./assets/model/textures/image_5.png"),
                  require("./assets/model/textures/image_6.png"),
                  require("./assets/model/textures/image_7.png"),
                  require("./assets/model/textures/image_8.png"),
                  require("./assets/model/textures/image_9.png"),
                  require("./assets/model/textures/image_10.png"),
                  require("./assets/model/textures/image_11.png"),
                  require("./assets/model/textures/image_12.png"),
                  require("./assets/model/textures/image_13.png"),
                  require("./assets/model/textures/image_14.png"),
                  require("./assets/model/textures/image_15.png"),
                  require("./assets/model/textures/image_16.png"),
                  require("./assets/model/textures/image_17.png"),
                  require("./assets/model/textures/image_18.png"),
                  require("./assets/model/textures/image_20.png"),
                  require("./assets/model/textures/image_21.png"),
                  require("./assets/model/textures/image_22.png"),
                  require("./assets/model/textures/image_23.png"),
                  require("./assets/model/textures/image_24.png"),
                  require("./assets/model/textures/image_25.png"),
                  require("./assets/model/textures/image_26.png"),
                  require("./assets/model/textures/image_27.png"),
                  require("./assets/model/textures/image_28.png"),
                  require("./assets/model/textures/image_29.png"),
                  require("./assets/model/textures/image_30.png"),
                  require("./assets/model/textures/image_31.png"),
                  require("./assets/model/textures/image_32.png"),
                  require("./assets/model/textures/image_33.png"),
                  require("./assets/model/textures/image_34.png"),
                  require("./assets/model/textures/image_35.png"),

                ]}
              />
              {/* </ViroARPlaneSelector> */}
              
              </ViroNode>
            </ViroARScene>
          ),
        }}
        style={styles.f1}
      />
    );
  }
  if (currentScreen == "ARScene2") {
    return (
      <ViroARSceneNavigator
      
      autofocus={true}
       initialScene={{
        scene:()=>(
          <ViroARScene>
      <ViroARImageMarker target={trackingTarget} onAnchorFound={handleAnchorFound}
        onAnchorRemoved={() => console.log('Anchor removed!')}
        >
        <ViroAmbientLight color="#ffffff" intensity={500} />
        <ViroDirectionalLight
  color="#ffffff"
  direction={[0, 10, -0.2]}
  intensity={500}
/>

        <Viro3DObject
                source={require("./assets/model/papermodel.gltf")}
                resources={[require("./assets/model/papermodel_0.bin"),
                  require("./assets/model/paper/image_0.png"),
                  require("./assets/model/paper/image_1.png"),
                  require("./assets/model/paper/image_2.png"),
                  require("./assets/model/paper/image_3.png"),
                  require("./assets/model/paper/image_4.png"),
                  require("./assets/model/paper/image_5.png"),
                  require("./assets/model/paper/image_6.png"),
                  require("./assets/model/paper/image_7.png"),
                  require("./assets/model/paper/image_8.png"),
                  require("./assets/model/paper/image_9.png"),
                  require("./assets/model/paper/image_10.png"),
                  require("./assets/model/paper/image_11.png"),
                  require("./assets/model/paper/image_12.png"),
                  require("./assets/model/paper/image_13.png"),
                  require("./assets/model/paper/image_14.png"),
                  require("./assets/model/paper/image_15.png"),
                  require("./assets/model/paper/image_16.png"),
                  require("./assets/model/paper/image_17.png"),
                  require("./assets/model/paper/image_18.png"),
                  require("./assets/model/paper/image_19.png"),
                  require("./assets/model/paper/image_20.png"),
                ]}
                type="GLTF" 
                scale={[0.01,0.01,0.01]}
                position={[0,0,0]}
              />
              {/* <Viro3DObject
                source={require("./assets/model/papermodel-2.glb")}
                type="GLB" 
                scale={[0.15,0.15,0.15]}
                position={[0,0,0]}
              /> */}
        
      </ViroARImageMarker>
    </ViroARScene>
    ),
    
  }}
       style={styles.f1}
      />
    );
  }
  if (currentScreen == "ARScene3") {
    return (
      <ViroARSceneNavigator
      
      autofocus={true}
       initialScene={{
        scene:()=>(
          <ViroARScene>
      <ViroARImageMarker target={"floorPlane"} onAnchorFound={handleAnchorFound}
        onAnchorRemoved={() => console.log('Anchor removed!')}
        >
        <ViroAmbientLight color="#ffffff" intensity={500} />
        <ViroDirectionalLight
  color="#ffffff"
  direction={[0, 10, -0.2]}
  intensity={500}
/>

        <Viro3DObject
                source={require("./assets/model/floorplan.glb")}
                type="GLB" 
                scale={[0.15,0.15,0.15]}
                position={[-3,-10,-1]}
              />
        
      </ViroARImageMarker>
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
