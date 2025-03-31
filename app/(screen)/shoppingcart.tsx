// app/(screen)/shoppingcart/shoppingcart.tsx
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "@/context/contexCart";

const ShoppingCart = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { updateQuantity, removeFromCart } = useCart();

  const {
    id,
    name,
    image,
    rating,
    price,
    oldPrice,
    discount,
    variations,
    quantity,
  } = params;

  const parsedQuantity = parseInt(quantity as string, 10);

  const handleIncreaseQuantity = () => {
    updateQuantity(id as string, parsedQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(id as string, parsedQuantity - 1);
  };

  const handleRemove = () => {
    removeFromCart(id as string);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>
      <Image source={{ uri: image as string }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>
        ${parseFloat(price as string).toFixed(2)}
      </Text>
      <Text style={styles.oldPrice}>
        ${parseFloat(oldPrice as string).toFixed(2)}
      </Text>
      <Text style={styles.discount}>Discount: {discount}</Text>
      <Text style={styles.variations}>Variations: {variations}</Text>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantity:</Text>
        <TouchableOpacity
          onPress={handleDecreaseQuantity}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{parsedQuantity}</Text>
        <TouchableOpacity
          onPress={handleIncreaseQuantity}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
        <Text style={styles.removeButtonText}>Remove from Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShoppingCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  oldPrice: {
    fontSize: 14,
    color: "#777",
    textDecorationLine: "line-through",
    marginBottom: 5,
  },
  discount: {
    fontSize: 14,
    color: "red",
    marginBottom: 10,
  },
  variations: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#FA7189",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FA7189",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 15,
  },
  removeButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
