import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Share,
} from "react-native";

import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { config } from "./config";

export default function App() {
  const [isLoding, setIsLoading] = useState(true);
  const [images, setImageData] = useState([]);
  const [scale, setScale] = useState(new Animated.Value(1));
  const [isImageFocused, setImageFocoused] = useState(false);

  // const scale = useRef(new Animated.Value(1)).current;

  const imageFocoused = useRef(isImageFocused);

  const animationScaleImage = { transform: [{ scale: scale }] };
  // const animationControls = scale.interpolate({
  //   inputRange: [0.9, 1],
  //   outputRange: [0, -80],
  // });
  const animationControls = {transform: [{
    translateY: scale.interpolate({
      inputRange: [0.9, 1],
      outputRange: [-80, 0]  // 0 : 150, 0.5 : 75, 1 : 0
    }),
  }]}


  const { height, width } = Dimensions.get("window");

  useEffect(() => {
    fetchImage();
  }, []);

  function fetchImage() {
    const url = `https://api.unsplash.com/photos/random?count=30&client_id=${config.accessKey}`;
    // console.log(url)
    axios
      .get(url)
      .then((resp) => {
        setImageData(resp.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
      .finally(() => console.log("Request Completed"));
  }

  function showControls(item) {
    setImageFocoused(!imageFocoused.current);
    // setScale({transform:[{scale:scale}]})
    // console.log(isImageFocused)
    // console.log(scale)
  }
  useEffect(() => {
    imageFocoused.current = isImageFocused;

    if (imageFocoused.current) {
      Animated.spring(scale, {
        toValue: 0.9,
        speed: 20,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        speed: 20,
        useNativeDriver: true
      }).start();
    }
    // console.log('Change is IMage focuoses', imageFocoused, isImageFocused, scale,newScale)
  }, [isImageFocused]);

  const saveToCameraRoll = async (image) => {
    let cameraPermissions = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (cameraPermissions.status !== "granted") {
      cameraPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    if (cameraPermissions.status === "granted") {
      FileSystem.downloadAsync(
        image.urls.regular,
        FileSystem.documentDirectory + image.id + ".jpg"
      )
        .then(({ uri }) => {
          // CameraRoll.save(uri,'photo');
          MediaLibrary.saveToLibraryAsync(uri);
          // console.log(uri)
          alert("Saved to photos");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Requires cameral roll permission");
    }
  };

  const shareWallpaper = async (image) => {
    try {
      await Share.share({
        message: "Checkout this wallpaper " + image.urls.full,
      });
    } catch (error) {
      console.log(error);
    }
  };

  function renderItem({ item }) {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => showControls(item)}>
          <Animated.View style={[{ height, width }, animationScaleImage]}>
            <Image
              style={{ flex: 1, height: null, width: null }}
              source={{ uri: item.urls.regular }}
              resizeMode="cover"
            />
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View
          style={[{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -80,
            height: 80,
            backgroundColor: "black",
            flexDirection: "row",
            justifyContent: "space-around",
          },animationControls]}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity activeOpacity={0.5} onPress={() => fetchImage()}>
              <Ionicons name="ios-refresh" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => shareWallpaper(item)}
            >
              <Ionicons name="ios-share" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => saveToCameraRoll(item)}
            >
              <Ionicons name="ios-save" color="white" size={40} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  return isLoding ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="grey" />
      </View>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <FlatList
          scrollEnabled={!isImageFocused}
          horizontal
          pagingEnabled
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
