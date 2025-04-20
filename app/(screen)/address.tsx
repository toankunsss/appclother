import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useAddress } from "../../context/addressContext";

const AddressScreen = () => {
  const router = useRouter();
  const {
    addresses,
    loading,
    fetchAddresses,
    deleteAddress,
    updateAddress,
    selectAddress,
  } = useAddress();

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSelectAddress = async (addressId) => {
    try {
      // Just update local state immediately
      selectAddress(addressId);
      router.back();

      // Update server state in background
      const selectedAddr = addresses.find((addr) => addr.id === addressId);
      if (!selectedAddr.isDefault) {
        // First, unset default for all addresses
        for (const addr of addresses) {
          if (addr.isDefault) {
            await updateAddress(addr.id, { ...addr, isDefault: false });
          }
        }
        // Set the selected address as default
        await updateAddress(addressId, { ...selectedAddr, isDefault: true });
      }
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(addressId);
            } catch (error) {
              Alert.alert("Error", "Failed to delete address");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.addressItem, item.isDefault && styles.selectedAddress]}
      onPress={() => handleSelectAddress(item.id)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.namePhone}>
          {item.name} | {item.phone}
        </Text>
        <Text>{item.address}</Text>
      </View>
      <View style={styles.addressActions}>
        {item.isDefault && (
          <FontAwesome6 name="location-dot" size={20} color="#007aff" />
        )}
        <TouchableOpacity
          onPress={() => handleDeleteAddress(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Address</Text>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No addresses found</Text>
        }
      />

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  addressActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  deleteButton: {
    padding: 5,
  },
  selectedAddress: {
    borderColor: "#007aff",
    borderWidth: 2,
  },
});
