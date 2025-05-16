import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
const WIDTH = Dimensions.get("screen").width;
const Procceed = ({ ship, total, procceed }: any) => {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const applyPromoCode = () => {
    // Giả lập logic kiểm tra mã promo
    if (promoCode === "DISCOUNT10") {
      setDiscount(total * 0.1); // Giảm 10%
    } else {
      alert("Invalid promo code");
    }
  };

  return (
    <View
      style={{ width: WIDTH, padding: 15, backgroundColor: "#fff", gap: 5 }}
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
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#000",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
          onPress={applyPromoCode}
        >
          <Text style={{ color: "#fff" }}>Apply</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text>Subtotal</Text>
        <Text>${total}</Text>
      </View>
      <View style={styles.row}>
        <Text>Discount</Text>
        <Text>-${discount.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Shipping</Text>
        <Text>$0{ship}</Text>
      </View>
      <View style={{ borderWidth: 1 }} />
      <View style={styles.row}>
        <Text>Total</Text>
        <Text>${(parseFloat(total) - discount).toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        onPress={procceed}
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
