import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useCart } from "@/context/contexCart";
import { useAuth } from "@/context/contextAuth";

interface AddCartProps {
  stock: number;
  product: any;
  selectedColor: string | null;
  selectedSize: string | null;
  onAddSuccess?: (event: any) => void;
}

const AddCart: React.FC<AddCartProps> = ({
  stock,
  product,
  selectedColor,
  selectedSize,
  onAddSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (event: any) => {
    if (
      product.sizes &&
      product.sizes.length > 0 &&
      product.sizes[0] !== "N/A" &&
      !selectedSize
    ) {
      Alert.alert("Lỗi", "Vui lòng chọn kích thước!");
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      Alert.alert("Lỗi", "Vui lòng chọn màu sắc!");
      return;
    }
    if (quantity > stock) {
      Alert.alert("Lỗi", "Số lượng vượt quá tồn kho!");
      return;
    }

    const cartItem = {
      name: product.name,
      image: product.images[0],
      rating: product.rating.average,
      price: product.sale_price,
      oldPrice: product.original_price,
      discount: `${(
        ((product.original_price - product.sale_price) /
          product.original_price) *
        100
      ).toFixed(0)}%`,
      variations: [],
      quantity: quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      user_id: user?.uid || "",
      product_id: product.id,
      added_at: new Date().toISOString(),
    };

    try {
      if (!user?.uid) {
        throw new Error("User not logged in");
      }
      await addToCart(cartItem);
      onAddSuccess?.(event);
      console.log("Added to cart:", cartItem);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
      console.error("Error adding to cart:", error);
    }
  };

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      Alert.alert("Thông báo", "Đã đạt số lượng tối đa trong kho!");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={decreaseQuantity}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity
          onPress={increaseQuantity}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.addButton, stock === 0 && styles.disabledButton]}
        onPress={(event) => {
          const { pageX, pageY } = event.nativeEvent;
          handleAddToCart({ locationX: pageX, locationY: pageY });
        }}
        disabled={stock === 0}
      >
        <Text style={styles.addButtonText}>
          {stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "500",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 15,
  },
  addButton: {
    backgroundColor: "#FA7189",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default AddCart;
