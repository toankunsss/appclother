import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import ButtonArrow from "./ButtonArrow";

const WIDTH = Dimensions.get("window").width; // Lấy chiều rộng màn hình

const HotBanner = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://i.pinimg.com/474x/7c/3b/bc/7c3bbcd983ac6f259738ae49429db7d6.jpg",
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>New Arrivals</Text>
          <Text style={styles.subtitle}>Summer’ 25 Collections</Text>
        </View>
        <ButtonArrow title="View all" backgroundColor="#F83758" />
      </View>
    </View>
  );
};

export default HotBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: WIDTH - 30, // Chiều rộng bằng màn hình
    marginVertical: 10,
  },
  image: {
    width: WIDTH - 30, // Chiều rộng bằng màn hình
    height: undefined, // Để chiều cao tự động
    aspectRatio: 16 / 9, // Tỷ lệ khung hình (có thể điều chỉnh)
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
