import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react"; // Thêm useState
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Link, useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { papal, visa, maestro, appleImag } from "@/contants/image/img";

const checkPayment = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState(null); // State để theo dõi payment được chọn

  const handlePress = (paymentType: any) => {
    setSelectedPayment(paymentType); // Cập nhật payment được chọn khi nhấn
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Link href="/(drawer)/(tabs)/shop" style={styles.cartIcon}>
          <FontAwesome6 name="heart" size={20} />
        </Link>
      </View>

      {/* cart */}
      <View style={styles.cartDetail}>
        <View style={[styles.row]}>
          <Text style={styles.text}>Order</Text>
          <Text style={styles.text}>7,000</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={styles.text}>Shipping</Text>
          <Text style={styles.text}>30</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={[styles.text, { color: "black" }]}>Total</Text>
          <Text style={[styles.text, { color: "black" }]}>7,030</Text>
        </View>
      </View>

      {/* payment */}
      <Text style={{ fontSize: 18 }}>Payment</Text>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={[
            styles.row,
            styles.cart,
            selectedPayment === "visa" && styles.selectedCart, // Thêm viền khi được chọn
          ]}
          onPress={() => handlePress("visa")}
        >
          <Image source={visa} />
          <Text style={{ color: "#c4c4c4" }}>000211221212</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.row,
            styles.cart,
            selectedPayment === "maestro" && styles.selectedCart,
          ]}
          onPress={() => handlePress("maestro")}
        >
          <Image source={maestro} />
          <Text style={{ color: "#c4c4c4" }}>000211221212</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.row,
            styles.cart,
            selectedPayment === "paypal" && styles.selectedCart,
          ]}
          onPress={() => handlePress("paypal")}
        >
          <Image source={papal} />
          <Text style={{ color: "#c4c4c4" }}>000211221212</Text>
        </TouchableOpacity>
      </View>

      {/* button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#F83758",
          justifyContent: "center",
          alignItems: "center",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 22 }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default checkPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  cartIcon: {
    padding: 5,
  },
  cartDetail: {
    borderTopColor: "#C6C6C6",
    borderTopWidth: 1,
    borderBottomColor: "#C9C9C9",
    borderBottomWidth: 1,
    gap: 15,
    paddingVertical: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    color: "#A8A8A9",
  },
  cart: {
    backgroundColor: "#F4F4F4",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedCart: {
    // Style mới cho viền khi được chọn
    borderWidth: 2,
    borderColor: "#F83758", // Màu viền (có thể thay đổi)
  },
});
