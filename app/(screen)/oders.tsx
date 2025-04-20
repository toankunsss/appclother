import React, { useState, useEffect } from "react";
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
import { getOrdersWithItems } from "../../api/api";
import { useAuth } from "@/context/contextAuth";

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      if (user?.uid) {
        const ordersData = await getOrdersWithItems(user.uid);
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const renderOrderItem = (order) => {
    const isCompleted = order.status === "shipped";
    const totalItems =
      order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
      <View key={order.id} style={styles.orderItem}>
        <Image
          source={{
            uri:
              order.items?.[0]?.product_image ||
              "https://via.placeholder.com/100",
          }}
          style={styles.productImage}
        />
        <View style={styles.orderDetails}>
          <Text style={styles.productTitle}>
            {order.items?.length || 0} items in order
          </Text>
          <Text style={styles.price}>${order.total_amount.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>Total Items: {totalItems}</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryStatus}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
            <Text style={styles.orderDate}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
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
        {orders
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
