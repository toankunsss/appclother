import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import ButtonArrow from "./ButtonArrow";
const postSale = ({ img, sale_off, describe }: any) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: img }}
        style={styles.imageBg}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <Text style={styles.saleOffText}>{sale_off}</Text>
        <Text style={styles.describeText}>{describe}</Text>
        <ButtonArrow title="Shop Now" backgroundColor="" />
      </ImageBackground>
    </View>
  );
};

export default postSale;

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 20,
    alignSelf: 'center',
  },
  imageBg: {
    width: WIDTH - 20,
    height: Math.round((WIDTH - 20) * 0.5),
    borderRadius: 16,
    justifyContent: "center",
    paddingLeft: 20,
    overflow: "hidden",
    alignSelf: 'center',
  },
  imageStyle: {
    borderRadius: 16,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  saleOffText: {
    color: "#FFF",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  describeText: {
    color: "#FFF",
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
