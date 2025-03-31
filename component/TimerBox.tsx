import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ButtonArrow from "./ButtonArrow";
const TimerBox = ({ house, minute, second }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4392F9",
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
            name="calendar-clock-outline"
            size={20}
            color="#FFF"
          />
          <Text style={{ fontSize: 12, color: "#FFF", marginLeft: 5 }}>
            {house}h {minute}m {second}s remaining
          </Text>
        </View>
      </View>
      <ButtonArrow title="View All" />
    </View>
  );
};

export default TimerBox;

const styles = StyleSheet.create({});
