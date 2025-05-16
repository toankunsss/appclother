import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { Link, useRouter } from "expo-router";
import Address from "@/component/address";
import { useAddress } from "@/context/contextAddress";
import { useLocalSearchParams } from "expo-router";
import { useCart } from "@/context/contexCart";

const Payment = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const { selectedAddress: addressObj } = useAddress();

  const { selectedItems, total } = useLocalSearchParams();
  const parsedSelectedItems =
    typeof selectedItems === "string" ? JSON.parse(selectedItems) : [];

  // Lọc các sản phẩm được chọn
  const selectedCartItems = cartItems.filter((item) =>
    parsedSelectedItems.includes(item.cart_id)
  );
  // Lấy danh sách tên sản phẩm đã chọn
  const selectedProductNames = selectedCartItems.map((item) => item.name);

  const handleProceedToPayment = () => {
    router.push({
      pathname: "/(screen)/checkPayment",
      params: {
        selectedItems: JSON.stringify(parsedSelectedItems),
        total: (parseFloat(Array.isArray(total) ? total[0] : total as string) + 30).toFixed(2), // Tổng giá trị bao gồm phí vận chuyển (30)
        productNames: JSON.stringify(selectedProductNames),
      },
    });
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
        <Link href="/(drawer)/(tabs)/shop" style={styles.cartIcon}>
          <FontAwesome6 name="heart" size={20} />
        </Link>
      </View>

      {/* Nội dung chính */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Address */}
        <Address selectedAddress={addressObj} />

        {/* Danh sách sản phẩm */}
        {selectedCartItems.map((item) => (
          <View key={item.cart_id} style={styles.productContainer}>
            <Image
              source={{ uri: item.image || "https://via.placeholder.com/100" }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        ))}

        {/* Apply Coupons */}
        <View style={styles.couponContainer}>
          <Text style={styles.couponText}>Apply Coupons</Text>
          <TouchableOpacity>
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
        </View>

        {/* Order Payment Details */}
        <View style={styles.paymentDetailsContainer}>
          <Text style={styles.sectionTitle}>Order Payment Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Amounts</Text>
            <Text style={styles.detailValue}>${total}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Convenience</Text>
            <Text style={[styles.detailValue, { color: "#F83758" }]}>
              Apply Coupon
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery Fee</Text>
            <Text style={[styles.detailValue, { color: "#F83758" }]}>FREE</Text>
          </View>
        </View>

        {/* Order Total */}
        <View style={styles.totalContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.sectionTitle}>Order Total</Text>
            <Text style={styles.detailValue}>${total}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>EMI AVAILABLE</Text>
            <TouchableOpacity>
              <Text style={styles.knowMoreText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer cố định */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceText}>${total}</Text>
        </View>
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.proceedText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  cartIcon: {
    padding: 5,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 100, // Để tránh bị che bởi footer
  },
  addressContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    position: "relative",
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  arrowIcon: {
    position: "absolute",
    right: 15,
    top: "50%",
  },
  productContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  quantityLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
  },
  quantityValue: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  couponContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  couponText: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectText: {
    fontSize: 14,
    color: "#F83758",
  },
  paymentDetailsContainer: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  knowMoreText: {
    fontSize: 14,
    color: "#F83758",
    marginHorizontal: 10,
  },
  totalContainer: {
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 35,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopStartRadius: 25,
    borderTopRightRadius: 25,
  },
  footerPrice: {
    flex: 1,
    justifyContent: "center",
  },
  footerPriceText: {
    fontSize: 18,
    fontWeight: "500",
  },
  viewDetailsText: {
    fontSize: 12,
    color: "#F83758",
  },
  proceedButton: {
    flex: 1,
    backgroundColor: "#F83758",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  proceedText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
