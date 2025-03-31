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
const WIDTH = Dimensions.get("window").width;

const Checkout = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);

  // Tính tổng tiền từ cartItems
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <View style={{ justifyContent: "space-between", flex: 1 }}>
      <View
        style={{
          paddingHorizontal: 15,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: "absolute", left: -10 }}
          >
            <Ionicons name="chevron-back" size={28} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Cart</Text>
        </View>

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
            <ProductItem
              item={item}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          )}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center", color: "#666" }}>
              Your cart is empty
            </Text>
          )}
        />
      </View>
      {cartItems.length > 0 && <Procceed total={totalAmount.toFixed(2)} />}
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
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
