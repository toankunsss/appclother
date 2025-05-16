import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const Address = ({ selectedAddress }: { selectedAddress?: { label?: string; address?: string } | null }) => {
  const addressObj = selectedAddress || null;
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 30,
          marginBottom: 10,
          gap: 5,
        }}
      >
        <SimpleLineIcons name="location-pin" size={15} />
        <Text style={{ fontSize: 14, fontWeight: "600" }}>
          Delivery Address
        </Text>
      </View>
      <View
        style={{
          padding: 15,
          backgroundColor: "white",
          elevation: 5,
          borderRadius: 4,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "500", marginBottom: 5 }}>
          Address
        </Text>
        <Text style={{ fontSize: 12 }}>
          {addressObj?.label || "216 St Paul's Rd, London"}
        </Text>
        <Text style={{ fontSize: 12 }}>Contact: {addressObj?.address || "216 St Paul's Rd, London"}</Text>
        <TouchableOpacity style={{ position: "absolute", right: 5, top: 5 }} onPress={() => {router.push("/(screen)/addressScreen")}}>
          <MaterialCommunityIcons name="square-edit-outline" size={20} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Address;
