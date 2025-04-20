import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface OrderItem {
  order_item_id: number;
  order_id: number | string;
  product_id: number | string;
  quantity: number;
  price: number;
  id: string;
}

interface Order {
  order_id: number;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  created_at: string;
  id: string;
}

const mockOrderItems = [
  {
    order_item_id: 1,
    order_id: 1,
    product_id: 1,
    quantity: 1,
    price: 699.99,
    id: "6959",
  },
  {
    order_item_id: 2,
    order_id: 1,
    product_id: 2,
    quantity: 1,
    price: 149.99,
    id: "6d1d",
  },
  {
    order_item_id: 3,
    order_id: 2,
    product_id: "4d56",
    quantity: 1,
    price: 149.99,
    id: "8c89",
  },
  {
    id: "0008",
    order_id: "cbb5",
    product_id: 1,
    quantity: 5,
    price: 699.99,
  },
  {
    id: "6456",
    order_id: "b626",
    product_id: 1,
    quantity: 1,
    price: 699.99,
  },
  {
    id: "672b",
    order_id: "b626",
    product_id: 1,
    quantity: 1,
    price: 699.99,
  },
];

const mockOrders = [
  {
    order_id: 1,
    user_id: "firebase-uid-1",
    total_amount: 749.98,
    status: "shipped",
    shipping_address: "123 Main St, Hanoi, Vietnam",
    created_at: "2025-03-10T09:00:00Z",
    id: "dff3",
  },
  {
    order_id: 2,
    user_id: "firebase-uid-2",
    total_amount: 149.99,
    status: "pending",
    shipping_address: "456 Oak St, Ho Chi Minh City, Vietnam",
    created_at: "2025-03-18T11:00:00Z",
    id: "c71f",
  },
  {
    id: "cbb5",
    user_id: "qHXLCo9uQZdmFL7IT10dhfuh3Kt2",
    total_amount: 3529.95,
    status: "pending",
    shipping_address: "Default Address",
    created_at: "2025-04-20T02:12:57.317Z",
  },
  {
    id: "b626",
    user_id: "qHXLCo9uQZdmFL7IT10dhfuh3Kt2",
    total_amount: 1429.98,
    status: "pending",
    shipping_address: "Default Address",
    created_at: "2025-04-20T02:31:02.801Z",
  },
];

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );
  const router = useRouter();
  const dummyImage = "https://via.placeholder.com/100";

  const renderOrderItem = (order: Order) => {
    const orderItems = mockOrderItems.filter(
      (item) => item.order_id.toString() === order.id.toString()
    );
    const isCompleted = order.status === "shipped";
    const totalQuantity = orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return (
      <View key={order.id} style={styles.orderItem}>
        <Image source={{ uri: dummyImage }} style={styles.productImage} />
        <View style={styles.orderDetails}>
          <Text style={styles.productTitle}>Bluebell Hand Block Tiered</Text>
          <Text style={styles.price}>${order.total_amount.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>Qty: {totalQuantity}</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryStatus}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
            <Text style={styles.discount}>40% Off</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Text style={styles.actionButtonText}>
            {isCompleted ? "Write Review" : "Track Order"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>My Order</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ongoing" && styles.activeTab]}
          onPress={() => setActiveTab("ongoing")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ongoing" && styles.activeTabText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.orderList}>
        {mockOrders
          .filter((order) =>
            activeTab === "ongoing"
              ? order.status === "pending"
              : order.status === "shipped"
          )
          .map(renderOrderItem)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  orderList: {
    flex: 1,
  },
  orderItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  deliveryInfo: {
    flexDirection: "row",
    marginTop: 4,
  },
  deliveryStatus: {
    color: "#4CAF50",
    marginRight: 8,
  },
  discount: {
    color: "#4CAF50",
  },
  actionButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#000",
    fontSize: 14,
  },
  quantityContainer: {
    marginTop: 4,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
  },
});
