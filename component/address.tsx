import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useAddress } from "../context/addressContext";

const Address = () => {
  const { defaultAddress } = useAddress();

  return (
    <>
      <View style={styles.headerContainer}>
        <SimpleLineIcons name="location-pin" size={15} />
        <Text style={styles.headerText}>Delivery Address</Text>
      </View>
      <View style={styles.addressBox}>
        <Text style={styles.label}>Address</Text>
        {defaultAddress ? (
          <>
            <Text style={styles.name}>{defaultAddress.name}</Text>
            <Text style={styles.address}>{defaultAddress.address}</Text>
            <Text style={styles.phone}>Contact: {defaultAddress.phone}</Text>
          </>
        ) : (
          <Text style={styles.noAddress}>No address selected</Text>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(screen)/address")}
        >
          <MaterialCommunityIcons name="square-edit-outline" size={20} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Address;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    gap: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addressBox: {
    padding: 15,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 3,
  },
  address: {
    fontSize: 12,
    marginBottom: 3,
  },
  phone: {
    fontSize: 12,
  },
  noAddress: {
    fontSize: 12,
    color: "#666",
  },
  editButton: {
    position: "absolute",
    right: 5,
    top: 5,
    padding: 5,
  },
});
