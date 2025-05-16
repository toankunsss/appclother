import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

const AddressSuccess = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.circleWrapper}>
        <View style={styles.circleOuter}>
          <View style={styles.circleMiddle}>
            <View style={styles.circleInner}>
              <Text style={styles.check}>✓</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.successTitle}>Success</Text>
      <Text style={styles.successDesc}>Địa chỉ của bạn đã được thêm thành công</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/(screen)/addressScreen") }>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  circleWrapper: {
    marginBottom: 36,
  },
  circleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E6F9EC",
    alignItems: "center",
    justifyContent: "center",
  },
  circleMiddle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#B6F2C6",
    alignItems: "center",
    justifyContent: "center",
  },
  circleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4ADE80",
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  successDesc: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4ADE80",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default AddressSuccess;
