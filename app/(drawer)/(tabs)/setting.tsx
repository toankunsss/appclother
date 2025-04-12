import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/contextAuth";
import Feather from "react-native-vector-icons/Feather"; // Use Feather icons
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { getUserById } from "@/api/api"; // Import your API function to get user data
import { ggImag } from "@/contants/image/img"; // Import your logo image
export default function ProfileScreen() {

  const menuItems = [
    { icon: "clock", label: "Order History", screen: "orderHistory" },
    { icon: "credit-card", label: "Payment Methods", screen: "paymentMethods" },
    { icon: "map-pin", label: "Delivery Addresses", screen: "addresses" },
    { icon: "heart", label: "Favorites", screen: "favorites" },
    { icon: "settings", label: "Settings", screen: "settings" },
    { icon: "help-circle", label: "Help & Support", screen: "support" },
  ];
  const router = useRouter();
  const { logout } = useAuth(); // Import the logout function from context
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
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={ggImag} style={{ width: 80, height: 80 }} />
        </View>
        <Text style={styles.email}>{userData.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/(screen)/profile")}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name={item.icon} size={22} color="#FF3B30" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#999999" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
        await logout(); // Call the logout function from context 
        router.replace("/(auth)/sign-in"); // Navigate to the sign-in screen
      }
      }>
        <Feather name="log-out" size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background
  },
  header: {
    backgroundColor: "#FFFFFF", // White
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light gray border
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF3B30", // Blue (primary color)
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333", // Dark gray text
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#999999", // Medium gray text
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF3B30", // Blue border
  },
  editButtonText: {
    color: "#FF3B30", // Blue text
    fontSize: 14,
    fontWeight: "500",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF", // White
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light gray border
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333333", // Dark gray text
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF", // White
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30", // Red (error color)
    fontWeight: "500",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24,
    fontSize: 12,
    color: "#999999", // Medium gray text
  },
});