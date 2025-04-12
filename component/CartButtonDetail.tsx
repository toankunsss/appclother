import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useCart } from "@/context/contexCart";

interface CartButtonProps {
  style?: any;
  targetRef?: React.RefObject<View>;
}

const CartButtonDetail: React.FC<CartButtonProps> = ({ style, targetRef }) => {
  const router = useRouter();
  const { cartItems } = useCart();

  return (
    <TouchableOpacity
      onPress={() => router.push("/shop")}
      style={[styles.container, style]}
    >
      <View ref={targetRef} style={styles.iconContainer}>
        <Feather name="shopping-cart" size={24} color="black" />
        {cartItems.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItems.length}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: "#EB3030",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CartButtonDetail;
