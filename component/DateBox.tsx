import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ButtonArrow from "./ButtonArrow";
const DateBox = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FD6E87",
        borderRadius: 10,
        padding: 10,
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <View style={{ gap: 5 }}>
        <Text style={{ color: "#FFF", fontWeight: "600" }}>
          Deal of the Day
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="calendar-month"
            size={20}
            color="#FFF"
          />
          <Text style={{ fontSize: 12, color: "#FFF", marginLeft: 5 }}>
            Last Date 29/02/22
          </Text>
        </View>
      </View>
      <ButtonArrow title="View All" />
    </View>
  );
};

export default DateBox;

const styles = StyleSheet.create({});
