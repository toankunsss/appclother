import {
  StyleSheet,
  Text,
  View,
  Animated,
  useWindowDimensions,
} from "react-native";
import React from "react";

const Paginator = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={{ flexDirection: "row" }}>
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 40, 10],
          extrapolate: "clamp",
        });
        const dotColor = scrollX.interpolate({
          inputRange,
          outputRange: ["#A9A9A9", "#000000", "#A9A9A9"], // Gray to Black to Gray
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
});
