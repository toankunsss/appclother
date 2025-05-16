import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAddressesByUserId, deleteAddressById, selectAddress } from "@/api/api";
import { useAuth } from "@/context/contextAuth";
import { useRouter } from "expo-router";
import { useAddress } from "@/context/contextAddress";

const AddressScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid || "";
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { setSelectedAddress } = useAddress();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await getAddressesByUserId(userId);
        if (res.addresses && res.addresses.length > 0) {
          // Đưa địa chỉ có isSelected=true lên đầu danh sách
          const selected = res.addresses.find((a:any) => a.isSelected);
          const filtered = res.addresses.filter((a:any) => !a.isSelected);
          const newAddresses = selected ? [selected, ...filtered] : res.addresses;
          setAddresses(newAddresses);
          setSelectedId(selected ? selected.id : newAddresses[0]?.id || null);
          setSelectedAddress(selected || newAddresses[0] || null);
          setMessage("");
        } else {
          setAddresses([]);
          setSelectedAddress(null);
          setMessage(res.message || "Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.");
        }
      } catch (err) {
        setAddresses([]);
        setSelectedAddress(null);
        setMessage("Không thể lấy danh sách địa chỉ.");
      }
      setLoading(false);
    };
    if (userId) fetchAddresses();
  }, [userId]);

  // Chọn địa chỉ, đưa lên đầu danh sách và đánh dấu chọn
  const handleSelectAddress = async (item: any) => {
    setSelectedId(item.id);
    setLoading(true);
    // Cập nhật trạng thái isSelected trong db
    await selectAddress(userId, item.id);
    // Reload lại danh sách để đồng bộ UI
    const res = await getAddressesByUserId(userId);
    const selected = res.addresses.find((a:any) => a.id === item.id);
    const filtered = res.addresses.filter((a:any) => a.id !== item.id);
    const newAddresses = selected ? [selected, ...filtered] : res.addresses;
    setAddresses(newAddresses);
    setSelectedAddress(selected || newAddresses[0] || null);
    setLoading(false);
    // Nếu muốn chuyển sang màn Payment thì gọi router.push ở đây
    // router.push({
    //   pathname: "/(screen)/Payment",
    //   params: {
    //     selectedAddress: JSON.stringify(item),
    //   },
    // });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa địa chỉ này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteAddressById(id);
              // Sau khi xóa, reload lại danh sách
              const res = await getAddressesByUserId(userId);
              setAddresses(res.addresses || []);
              setMessage(res.message || "");
              setLoading(false);
            } catch (err) {
              setLoading(false);
              Alert.alert("Lỗi", "Không thể xóa địa chỉ. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => handleSelectAddress(item)}>
            <View style={styles.radioOuter}>
              {item.isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.sendTo}>SEND TO</Text>
            <Text style={styles.label}>{item.label || `Address ${item.address_id}`}</Text>
            <Text style={styles.detail}>{item.address}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.push({ pathname: "/(screen)/editAddr", params: { id: item.id } })}>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={[styles.edit, { color: "#F00", marginLeft: 16 }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery address</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Address List */}
      {loading ? (
        <ActivityIndicator size="large" color="#222" style={{ marginTop: 40 }} />
      ) : addresses.length > 0 ? (
        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#A8A8A9", fontSize: 16, textAlign: "center" }}>{message}</Text>
        </View>
      )}
      {/* Add new address button */}
      <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(screen)/insertAddr") }>
          <Text style={styles.addButtonText}>Add new address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#222",
  },
  sendTo: {
    fontSize: 11,
    color: "#A8A8A9",
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  detail: {
    fontSize: 13,
    color: "#A8A8A9",
  },
  edit: {
    color: "#F83758",
    fontWeight: "bold",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default AddressScreen;
