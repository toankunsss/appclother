import { Drawer } from "expo-router/drawer";
import { usePathname } from "expo-router";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Feather from "react-native-vector-icons/Feather";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "@/component/header";
import { ggImag, logo } from "@/contants/image/img";
import { useAuth } from "@/context/contextAuth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { getUserById } from "@/api/api"; // Import your API function to get user data
export default function DrawerLayout() {
  const router = useRouter();
  const { logout } = useAuth();
  const pathname = usePathname();
  // Các trang cần ẩn Drawer
  const hiddenDrawerTabs = ["/search", "/setting", "/shop"];
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
  const CustomDrawerContent = (props: any) => {
    return (
      <>
        <DrawerContentScrollView {...props}>
          <View style={styles.userInforWrapper}>
            <Image style={styles.imageInforWrapper} source={ggImag} />
            <View style={styles.containerTextInforWrapper}>
              <Text style={styles.textInforWrapper}>{userData.email}</Text>
            </View>
          </View>
          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="home" size={24} color={color} />
            )}
            label={"Home"}
            onPress={() => {
              router.replace("/(drawer)/(tabs)/home");
            }}
          />
        </DrawerContentScrollView>
        <View style={styles.containerFuntion}>
          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="log-out" size={24} color={color} />
            )}
            label={"Log Out"}
            onPress={async () => {
              await logout();
              router.replace("/(auth)/sign-in"); // chuyển về trang login
            }}
          />
        </View>
      </>
    );
  };
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: !hiddenDrawerTabs.includes(pathname), // Ẩn header nếu trong danh sách
        swipeEnabled: !hiddenDrawerTabs.includes(pathname), // Chặn vuốt mở Drawer
        header: () => <Header />,
        drawerType: "slide",
        overlayColor: "rgba(0,0,0,0.7)",
        drawerStyle: {
          width: "75%",
        },
        swipeEdgeWidth: 100,
        swipeMinDistance: 20,
      }}
    />
  );
}
const styles = StyleSheet.create({
  userInforWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  imageInforWrapper: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  containerTextInforWrapper: {
    marginLeft: 10,
    justifyContent: "center",
  },
  textNameInforWrapper: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textInforWrapper: {
    color: "#ccc",
  },
  containerFuntion: {
    marginBottom: 40,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
});
