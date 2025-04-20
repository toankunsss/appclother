import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProductItem from "@/component/shopProduct";
import { useCart } from "@/context/contexCart";
import { useAuth } from "@/context/contextAuth";
import Procceed from "@/component/procceed";

interface CartItem {
  cart_id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  oldPrice: number;
  discount: string;
  variations: string[];
  quantity: number;
  size?: string;
  color?: string;
  user_id: string;
  product_id: number;
  serverId?: string;
  added_at: string;
  id?: string; // Có thể bỏ trường này nếu không cần, vì đã có serverId
}
const WIDTH = Dimensions.get("window").width;

export default function Shop() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (cartId: string) => {
    setSelectedItems((prev) =>
      prev.includes(cartId)
        ? prev.filter((id) => id !== cartId)
        : [...prev, cartId]
    );
  };

  // Calculate total only for selected items
  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item.cart_id))
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { productId: productId.toString() }, // Chỉ truyền product_id
    });
    console.log("Product ID:", productId); // Kiểm tra giá trị productId
  };
  const handleProcced = () => {
    if (selectedItems.length > 0) {
      router.push({
        pathname: "/(screen)/Payment",
        params: {
          selectedItems: JSON.stringify(selectedItems),
          total: totalAmount.toFixed(2),
        },
      });
      setSelectedItems([]); // Reset selected items after proceeding
    }

    console.log("Selected Items:", selectedItems); // Kiểm tra giá trị selectedItems
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 0, top: 10 }}
        >
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 15,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              marginBottom: 18,
              fontSize: 20,
              marginTop: 20,
            }}
          >
            Shopping List
          </Text>
          <FlatList
            data={cartItems}
            showsVerticalScrollIndicator
            keyExtractor={(item) => item.cart_id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleSelectItem(item.cart_id)}
                  style={{ padding: 10 }}
                >
                  <Ionicons
                    name={
                      selectedItems.includes(item.cart_id)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color={
                      selectedItems.includes(item.cart_id) ? "#FA7189" : "#666"
                    }
                  />
                </TouchableOpacity>
                <ProductItem
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  handleProductPress={handleProductPress}
                />
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: "center", color: "#666" }}>
                Your cart is empty
              </Text>
            )}
          />
        </View>
        {selectedItems.length > 0 && (
          <Procceed
            total={totalAmount.toFixed(2)}
            selectedItems={selectedItems}
            procceed={handleProcced}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  checkoutButton: {
    backgroundColor: "#FA7189",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
