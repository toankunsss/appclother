import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

// Example address list
const addressData = [
  {
    id: "1",
    name: "Toan",
    phone: "0123456789",
    address: "123 Le Loi, District 1, HCMC",
    isDefault: true,
  },
  {
    id: "2",
    name: "Mai",
    phone: "0987654321",
    address: "456 Hai Ba Trung, District 3, HCMC",
    isDefault: false,
  },
];

const AddressScreen = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.addressItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.namePhone}>
          {item.name} | {item.phone}
        </Text>
        <Text>{item.address}</Text>
      </View>
      {item.isDefault && (
        <FontAwesome6 name="location-dot" size={20} color="#007aff" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Address</Text>
      </View>

      {/* Address list */}
      <FlatList
        data={addressData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* Add new address button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-address")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 20,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  namePhone: {
    fontWeight: "500",
    marginBottom: 5,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
});
