import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { special } from "@/contants/image/img";
const Banner = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 15,
        height: 100,
        alignItems: "center",
      }}
    >
      <Image source={special} style={{ marginLeft: 10 }} />
      <View style={{ marginLeft: 20 }}>
        <Text style={{ fontWeight: "500" }}>Special Offers😱</Text>
        <Text style={{ fontSize: 12 }}>We make sure you get the</Text>
        <Text style={{ fontSize: 12 }}>the offer you need at best</Text>
      </View>
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({});
