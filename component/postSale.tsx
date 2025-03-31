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
const postSale = ({ img, sale_off, describe }: any) => {
  return (
    <TouchableOpacity style={{ marginRight: 10 }}>
      <ImageBackground
        source={{ uri: img }}
        style={{
          width: WIDTH - 30,
          height: 200,
          borderRadius: WIDTH / 20,
          justifyContent: "center",
          paddingLeft: 20,
        }}
        imageStyle={{ borderRadius: 10 }}
        resizeMode="stretch"
      >
        <Text style={{ color: "#FFF", fontSize: 40, lineHeight: 40 }}>
          {sale_off}
        </Text>
        <Text style={{ color: "#FFF", fontSize: 20, lineHeight: 40 }}>
          {describe}
        </Text>
        <ButtonArrow title="Shop Now" backgroundColor="" />
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default postSale;

const styles = StyleSheet.create({});
