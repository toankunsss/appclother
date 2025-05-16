import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { papal, visa, maestro, appleImag } from "@/contants/image/img";
import { useCart } from "@/context/contexCart";
import { check } from "@/contants/image/img";
import { useNotification } from "@/context/NotificationContext";
const checkPayment = () => {
  const router = useRouter();
  const { total, selectedItems, productNames } = useLocalSearchParams();
  const { removeFromCart } = useCart();
  const parsedSelectedItems =
    typeof selectedItems === "string" ? JSON.parse(selectedItems) : [];
  const parsedProductNames =
    typeof productNames === "string" ? JSON.parse(productNames) : [];
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handlePress = (paymentType: any) => {
    setSelectedPayment(paymentType);
  };

  const { addNotification } = useNotification();
  const user_id = "firebase-uid-1"; // Lấy user_id thực tế từ context/auth nếu có
  const handlePayment = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }
    // Tạo message chứa tên sản phẩm đã thanh toán
    const productList = parsedProductNames.join(", ");
    const message = `Bạn đã thanh toán: ${productList}`;
    // Thêm notification mới
    addNotification({
      id: Date.now().toString(),
      user_id,
      message,
      created_at: new Date().toISOString(),
    });
    setShowSuccessModal(true);
  };

  const handleContinueAfterSuccess = async () => {
    // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
    for (const cartId of parsedSelectedItems) {
      await removeFromCart(cartId);
    }
    setShowSuccessModal(false);
    router.navigate("/(drawer)/(tabs)/shop");
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

      {/* Cart Details */}
      <View style={styles.cartDetail}>
        <View style={[styles.row]}>
          <Text style={styles.text}>Order</Text>
          <Text style={styles.text}>{parseFloat(total as string) - 30}</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={styles.text}>Shipping</Text>
          <Text style={styles.text}>30</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={[styles.text, { color: "black" }]}>Total</Text>
          <Text style={[styles.text, { color: "black" }]}>{total}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <Text style={{ fontSize: 18 }}>Payment</Text>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={[
            styles.row,
            styles.cart,
            selectedPayment === "visa" && styles.selectedCart,
          ]}
          onPress={() => handlePress("visa")}
        >
          <Image source={visa} />
          <Text style={{ color: "#c4c4c4" }}>**** **** **** 2709</Text>
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
          <Text style={{ color: "#c4c4c4" }}>**** **** **** 2709</Text>
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
          <Text style={{ color: "#c4c4c4" }}>**** **** **** 2709</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#F83758",
          justifyContent: "center",
          alignItems: "center",
          padding: 15,
          borderRadius: 8,
        }}
        onPress={handlePayment}
      >
        <Text style={{ color: "#fff", fontSize: 22 }}>Continue</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.checkIconContainer}>
              <Image
                source={check}
                style={{ width: 50, height: 50 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.successText}>Payment done successfully.</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueAfterSuccess}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: "center",
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
    borderWidth: 2,
    borderColor: "#F83758",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  checkIconContainer: {
    backgroundColor: "#F83758",
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  paymentIcon: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
  cardNumber: {
    fontSize: 16,
    color: "#666",
  },
  continueButton: {
    backgroundColor: "#F83758",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
