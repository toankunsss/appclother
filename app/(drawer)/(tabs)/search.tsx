import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNotification } from "@/context/contextNotification";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const NotificationScreen = () => {
  const { notifications, removeNotification } = useNotification();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>Purchase Confirmation</Text>
            {item.items.map((product, index) => (
              <View
                key={`${item.id}-${product.product_id}-${index}`}
                style={styles.productItem}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetails}>
                  ${product.price.toFixed(2)} x {product.quantity}
                </Text>
                <Text style={styles.productTotal}>
                  Total: ${(product.price * product.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <Text style={styles.notificationTotal}>
              Order Total: ${item.total}
            </Text>
            <Text style={styles.notificationTimestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeNotification(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#F83758" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noNotifications}>No notifications yet</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
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
  notificationItem: {
    backgroundColor: "#F4F4F4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    position: "relative",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  productItem: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  productDetails: {
    fontSize: 12,
    color: "#666",
  },
  productTotal: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  notificationTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  deleteButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  noNotifications: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingVertical: 10,
  },
});
