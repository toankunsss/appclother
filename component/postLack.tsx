import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import ButtonArrow from "./ButtonArrow";
const PostLack = () => {
  return (
    <TouchableOpacity style={{}}>
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/474x/72/06/09/72060992fc40f9533ec962c00c56758e.jpg",
        }}
        style={{
          width: WIDTH - 30,
          height: 200,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingRight: 15,
        }}
        imageStyle={{ borderRadius: 10 }}
        resizeMode="stretch"
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              lineHeight: 16,
              marginVertical: 10,
              fontWeight: "500",
            }}
          >
            Flat and Heels
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: 10,
              lineHeight: 10,
              marginBottom: 10,
            }}
          >
            Stand a chance to get rewarded{" "}
          </Text>
        </View>
        <ButtonArrow title="Visit now" backgroundColor="#F83758" />
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default PostLack;

const styles = StyleSheet.create({});
