import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Rating } from "react-native-ratings";

const Product = ({ product }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.imageStyle} />
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.describe}>
          {product.description}
        </Text>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text
            style={[
              styles.price,
              { textDecorationLine: "line-through", color: "#bbbbbb" },
            ]}
          >
            ${product.original_price}
          </Text>
          <Text style={styles.price}>${product.sale_price}</Text>
        </View>
        <View style={styles.starCount}>
          <Rating
            type="star"
            ratingCount={5}
            showRating={false}
            imageSize={10}
            startingValue={product.rating.average}
            readonly
          />
          <Text style={styles.count}>{product.rating.count}</Text>
        </View>
      </View>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: "auto",
    resizeMode: "cover",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
    paddingBottom: 10,
  },
  starCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  describe: {
    fontSize: 10,
  },
  price: {
    fontWeight: "500",
    fontSize: 12,
    paddingVertical: 5,
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  count: {
    fontSize: 10,
    color: "#A4A9B3",
  },
});
