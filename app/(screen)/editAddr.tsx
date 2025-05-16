import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { updateAddressById, getAddressesByUserId } from "@/api/api";
import { useAuth } from "@/context/contextAuth";

const EditAddr = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const userId = user?.uid || "";
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const fetchAddr = async () => {
      setInitLoading(true);
      try {
        const res = await getAddressesByUserId(userId);
        const addr = (res.addresses || []).find((a:any) => a.id === id);
        if (addr) {
          setAddress(addr.address);
          setLabel(addr.label || "");
        }
      } catch {}
      setInitLoading(false);
    };
    if (userId && id) fetchAddr();
  }, [userId, id]);

  const handleUpdate = async () => {
    if (!address.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập địa chỉ chi tiết.");
      return;
    }
    setLoading(true);
    try {
      await updateAddressById(id, {
        user_id: userId,
        address,
        label,
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
      router.replace("/(screen)/addressSuccess");
    } catch (err) {
      setLoading(false);
      Alert.alert("Lỗi", "Không thể cập nhật địa chỉ. Vui lòng thử lại.");
    }
  };

  if (initLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#222" />
      </View>
    );
  }

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
          <Text style={styles.title}>Chỉnh sửa địa chỉ</Text>
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
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</Text>
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

export default EditAddr;
