import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomButton from "@/component/customButton";
import FormField from "@/component/formfield";
import { auth } from "../../firebase/firebaseConfig";
import { getUserById, updateCustomerInfo } from "@/api/api";
import { ggImag } from "@/contants/image/img";
const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    email: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    bankAccountNumber: "",
    accountHolderName: "",
    ifscCode: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const data = await getUserById(user.uid);
          console.log("Dữ liệu người dùng được lấy:", data);
          setUserData(data);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      setLoading(true);
      try {
        const updatedData = {
          pincode: userData.pincode,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          bankAccountNumber: userData.bankAccountNumber,
          accountHolderName: userData.accountHolderName,
          ifscCode: userData.ifscCode,
        };

        console.log("Dữ liệu gửi để cập nhật:", updatedData);
        const response = await updateCustomerInfo(user.uid, updatedData);
        console.log("Phản hồi từ API sau khi cập nhật:", response);

        Alert.alert("Thành công", "Thông tin đã được cập nhật!", [
          { text: "OK", onPress: () => router.push("/home") },
        ]);
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Không tìm thấy người dùng hiện tại.");
      Alert.alert("Lỗi", "Vui lòng đăng nhập để tiếp tục.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 10 }}
        >
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image
            source={ggImag} // Ảnh mẫu tĩnh
            style={styles.avatar}
          />
        </View>

        {/* Personal Details Section */}
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <FormField
          title="Email"
          value={userData.email}
          placeholder="Your Email"
          handldeChangeText={() => { }} // Không cho phép chỉnh sửa email
          otherStyles={styles.textInputStyle}
          keyboardType="email-address"
          editable={false}
        />
        <FormField
          title="Password"
          value="********"
          placeholder="Password"
          handldeChangeText={() => { }}
          otherStyles={styles.textInputStyle}
          secureTextEntry={true}
          editable={false}
        />
        <TouchableOpacity onPress={() => router.push("/(auth)/forgot")}>
          <Text style={styles.changePassword}>Change Password</Text>
        </TouchableOpacity>

        {/* Business Address Details Section */}
        <Text style={styles.sectionTitle}>Business Address Details</Text>
        <FormField
          title="Pincode"
          value={userData.pincode}
          placeholder="Pincode"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, pincode: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="Address"
          value={userData.address}
          placeholder="Address"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, address: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="City"
          value={userData.city}
          placeholder="City"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, city: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="State"
          value={userData.state}
          placeholder="State"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, state: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="Country"
          value={userData.country}
          placeholder="Country"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, country: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />

        {/* Bank Account Details Section */}
        <Text style={styles.sectionTitle}>Bank Account Details</Text>
        <FormField
          title="Bank Account Number"
          value={userData.bankAccountNumber}
          placeholder="Bank Account Number"
          handldeChangeText={(value: any) =>
            setUserData({
              ...userData,
              bankAccountNumber: value.nativeEvent.text,
            })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="Account Holder's Name"
          value={userData.accountHolderName}
          placeholder="Account Holder's Name"
          handldeChangeText={(value: any) =>
            setUserData({
              ...userData,
              accountHolderName: value.nativeEvent.text,
            })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="IFSC Code"
          value={userData.ifscCode}
          placeholder="IFSC Code"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, ifscCode: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />

        <CustomButton
          title="Save"
          handleChangeText={handleSave}
          containerStyles={styles.button}
          TextStyles={styles.textbutton}
          isLoading={loading}
        />
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF3B30", // Màu nền giống hình mẫu
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#C8C8C8",
    paddingHorizontal: 15,
    marginBottom: 10,
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  changePassword: {
    color: "#FF3B30",
    fontSize: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    textAlign: "right",
  },
  button: {
    height: 52,
    borderRadius: 8,
    backgroundColor: "#F83758",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  textbutton: {
    color: "#fff",
    fontSize: 15,
  },
});