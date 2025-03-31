import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

interface ProductProps {
  item: {
    cart_id: string;
    product_id: number;
    name: string;
    image: string;
    price: number;
    oldPrice: number;
    discount: string;
    size?: string;
    color?: string;
    quantity: number;
  };
  onRemove: (cart_id: string) => void;
  onUpdateQuantity: (cart_id: string, quantity: number) => void;
}

const ProductItem: React.FC<ProductProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  const increaseQuantity = () => {
    onUpdateQuantity(item.cart_id, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.cart_id, item.quantity - 1);
    }
  };

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/120" }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.name || "Unknown Product"}</Text>
          {item.size && (
            <Text style={styles.variations}>Size: {item.size}</Text>
          )}
          {item.color && (
            <View
              style={{ flexDirection: "row", alignItems: "center", height: 30 }}
            >
              <Text>Color: </Text>
              <View
                style={{
                  borderWidth: 1,
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                  backgroundColor: item.color,
                }}
              />
            </View>
          )}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${(item.price || 0).toFixed(2)}</Text>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.discount}>up to {item.discount || "0%"}</Text>
              <Text style={styles.oldPrice}>
                ${(item.oldPrice || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={increaseQuantity}>
            <AntDesign name="pluscircleo" size={20} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <TouchableOpacity onPress={decreaseQuantity}>
            <AntDesign name="minuscircleo" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.cart_id)}
      >
        <AntDesign name="delete" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 3,
    padding: 10,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  variations: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    borderWidth: 0.5,
    padding: 5,
    borderRadius: 4,
  },
  discount: {
    fontSize: 8,
    color: "red",
    marginLeft: 8,
  },
  oldPrice: {
    fontSize: 12,
    color: "#777",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  quantityContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 5,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 8,
    backgroundColor: "red",
  },
});

export default ProductItem;
