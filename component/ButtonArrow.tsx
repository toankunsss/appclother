import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
const ButtonArrow = ({ title, backgroundColor, borderColor }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        alignItems: "center",
        borderWidth: 2,
        width: 110,
        padding: 5,
        borderRadius: 5,
        borderColor: borderColor || "#FFF",
        backgroundColor: backgroundColor || "transparent",
      }}
    >
      <Text style={{ color: "#FFF" }}>{title}</Text>
      <FontAwesome6 name="arrow-right-long" size={14} color="#FFF" />
    </View>
  );
};

export default ButtonArrow;

const styles = StyleSheet.create({});
