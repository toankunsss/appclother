import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
} from "react-native";
import React from "react";

const onboardingItems = ({ item }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={item.image}
        style={[
          styles.image,
          { width: 300, height: 300, resizeMode: "contain" },
        ]}
      />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default onboardingItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 0.5,
    justifyContent: "center",
    width: 300,
    height: 300,
  },
  title: {
    fontWeight: "800",
    fontSize: 24,
    marginBottom: 10,
    color: "#000000",
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    color: "#A8A8A8",
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 43.37,
  },
});
