import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios'
import { config } from './config'

export default function App() {

  const [isLoding, setIsLoading] = useState(true)
  const [images, setImageData] = useState([])
  const [scale, setScale] = useState(new Animated.Value(1))
  const [isImageFocused, setImageFocoused] = useState(false)

  // const scale = useRef(new Animated.Value(1)).current;
  
  const imageFocoused = useRef(isImageFocused)
  
  const { height, width } = Dimensions.get('window')

  useEffect(() => {
    fetchImage()

  }, [])
  
  function fetchImage() {
    const url = `https://api.unsplash.com/photos/random?count=30&client_id=${config.accessKey}`
    // console.log(url)
    axios.get(url)
      .then((resp) => {
        setImageData(resp.data)
        setIsLoading(false)
      })
      .catch((err) => console.log(err))
      .finally(() => console.log("Request Completed"))
  }



  function showControls(item) {
    setImageFocoused(!imageFocoused.current)
    // setScale({transform:[{scale:scale}]})
    // console.log(isImageFocused)
    // console.log(scale)
  }
  useEffect(() => {
    imageFocoused.current = isImageFocused
    
    if(imageFocoused.current){
      Animated.spring(scale,{
        toValue:0.9,
        speed:20,
      }).start()
    }
    else{
      Animated.spring(scale,{
        toValue:1,
        speed:20,
      }).start()
    }
    // console.log('Change is IMage focuoses', imageFocoused, isImageFocused, scale,newScale)
  }, [isImageFocused])


  function renderItem({ item }) {
    return (
      <TouchableWithoutFeedback onPress={() => showControls(item)}>
        <Animated.View style={[{ height, width },{transform: [{ scale: scale }] }]}>
          <Image
            style={{ flex: 1, height: null, width: null }}
            source={{ uri: item.urls.regular }}
            resizeMode="cover"
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

 

  return isLoding ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  ) : (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator size="large" color="grey" />
        </View>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <FlatList
            horizontal
            pagingEnabled
            data={images}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
