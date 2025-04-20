import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, { useState, useContext } from "react";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { papal, visa, maestro } from "@/contants/image/img";
import { useCart } from "@/context/contexCart";
import { useAuth } from "@/context/contextAuth";
import { NotificationContext } from "@/context/contextNotification";
import { check } from "@/contants/image/img";
import { addOrderAPI, addOrderItemAPI } from "@/api/api";

const CheckPayment = () => {
  const router = useRouter();
  const { total, selectedItems } = useLocalSearchParams();
  const { removeFromCart, cartItems } = useCart();
  const { user } = useAuth();
  const { addNotification } = useContext(NotificationContext);
  const parsedSelectedItems = selectedItems ? JSON.parse(selectedItems) : [];
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePress = (paymentType: any) => {
    setSelectedPayment(paymentType);
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!user) {
      alert("Please log in to proceed with payment");
      return;
    }

    try {
      // Tạo đơn hàng mới
      const orderData = {
        user_id: user.uid,
        total_amount: parseFloat(total),
        shipping_address: "Default Address",
        created_at: new Date().toISOString(),
      };
      const orderResponse = await addOrderAPI(orderData);

      // Thu thập thông tin sản phẩm đã mua
      const purchasedItems = [];
      for (const cartId of parsedSelectedItems) {
        const cartItem = cartItems.find((item) => item.cart_id === cartId);
        if (cartItem) {
          await addOrderItemAPI({
            order_id: orderResponse.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.price,
          });
          purchasedItems.push({
            product_id: cartItem.product_id,
            name: cartItem.name || "Unknown Product", // Giả sử cartItem có name
            price: cartItem.price,
            quantity: cartItem.quantity,
          });
        }
      }

      // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
      for (const cartId of parsedSelectedItems) {
        await removeFromCart(cartId);
      }

      // Thêm thông báo mới với thông tin sản phẩm
      addNotification({
        id: `notif_${Date.now()}`,
        type: "purchase",
        items: purchasedItems,
        total: parseFloat(total).toFixed(2),
        timestamp: new Date().toISOString(),
      });

      // Hiển thị modal thành công
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  };

  const handleContinueAfterSuccess = () => {
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
          <Text style={styles.text}>{(parseFloat(total) - 30).toFixed(2)}</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={styles.text}>Shipping</Text>
          <Text style={styles.text}>30.00</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={[styles.text, { color: "black" }]}>Total</Text>
          <Text style={[styles.text, { color: "black" }]}>
            {parseFloat(total).toFixed(2)}
          </Text>
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
        <TouchableOpacity
          style={[styles.row, styles.cart, { backgroundColor: "#ccc" }]}
        >
          <Ionicons name="add-circle-outline" size={30} />
          <Text style={{ color: "#fff" }}>Add Card</Text>
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
                resizeMode="stretch"
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

export default CheckPayment;

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
