import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
const WIDTH = Dimensions.get("screen").width;
const Procceed = ({ ship, total, subtotal }: any) => {
  return (
    <View
      style={{
        width: WIDTH,
        padding: 15,
        backgroundColor: "#fff",
        gap: 5,
      }}
    >
      <View style={[styles.row, { gap: 10 }]}>
        <TextInput
          style={{
            backgroundColor: "#E3DFDF",
            flex: 3,
            borderRadius: 10,
            padding: 10,
          }}
          placeholder="PROMO CODE"
        ></TextInput>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#000",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff" }}>Chonse</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row]}>
        <Text>Subtotal</Text>
        <Text>${subtotal}</Text>
      </View>
      <View style={[styles.row]}>
        <Text>Shipping</Text>
        <Text>${ship}</Text>
      </View>
      <View style={{ borderWidth: 1 }}> </View>
      <View style={[styles.row]}>
        <Text>Total</Text>
        <Text>${total}</Text>
      </View>
      <TouchableOpacity
        style={{
          alignItems: "center",
          backgroundColor: "#F83758",
          padding: 10,
          borderRadius: 10,
          marginTop: 5,
        }}
      >
        <Text style={{ color: "#fff" }}>Proceed Checked</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Procceed;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
