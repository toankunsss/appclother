import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { addAddressForUser } from "@/api/api";
import { useAuth } from "@/context/contextAuth";

const InsertAddr = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid || "";
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddAddress = async () => {
    if (!address.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập địa chỉ chi tiết.");
      return;
    }
    setLoading(true);
    try {
      const newAddress = {
        user_id: userId,
        address,
        label,
        created_at: new Date().toISOString(),
      };
      await addAddressForUser(newAddress);
      setLoading(false);
      router.replace("/(screen)/addressSuccess");
    } catch (err) {
      setLoading(false);
      Alert.alert("Lỗi", "Không thể thêm địa chỉ mới. Vui lòng thử lại.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>Thêm địa chỉ mới</Text>
          <View style={{ width: 26 }} />
        </View>
        <Text style={styles.label}>Tên địa chỉ (ví dụ: Nhà riêng, Văn phòng)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên địa chỉ (tùy chọn)"
          value={label}
          onChangeText={setLabel}
        />
        <Text style={styles.label}>Địa chỉ chi tiết</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Nhập địa chỉ chi tiết"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleAddAddress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Đang lưu..." : "Lưu địa chỉ"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#F9F9F9",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#222",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  cancelBtn: {
    alignItems: "center",
    marginTop: 18,
  },
  cancelText: {
    color: "#F83758",
    fontSize: 16,
  },
});

export default InsertAddr;
