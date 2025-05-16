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
  const hiddenDrawerTabs = ["/search", "/setting", "/shop", "/notification", "/profile"];
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
      <View style={{ flex: 1, backgroundColor: '#fff', borderTopRightRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' }}>
        <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}>
          {/* User Info */}
          <View style={stylesV2.profileSection}>
            <Image style={stylesV2.avatar} source={ggImag} />
            <View style={{ marginLeft: 12 }}>
              <Text style={stylesV2.name}>Sunie Pham</Text>
              <Text style={stylesV2.email}>{userData.email || 'sunieux@gmail.com'}</Text>
            </View>
          </View>
          {/* Main Menu */}
          <View style={stylesV2.menuSection}>
            <DrawerItem
              icon={({ color, size }) => <Feather name="home" size={22} color={color} />}
              label={() => <Text style={stylesV2.menuLabelActive}>Homepage</Text>}
              style={stylesV2.menuItemActive}
              onPress={() => router.replace("/(drawer)/(tabs)/home")}
            />
            <DrawerItem
              icon={({ color, size }) => <Feather name="search" size={22} color={color} />}
              label={() => <Text style={stylesV2.menuLabel}>Discover</Text>}
              style={stylesV2.menuItem}
              onPress={() => router.replace("/(drawer)/(tabs)/search")}
            />
            <DrawerItem
              icon={({ color, size }) => <Feather name="shopping-bag" size={22} color={color} />}
              label={() => <Text style={stylesV2.menuLabel}>My Order</Text>}
              style={stylesV2.menuItem}
              onPress={() => router.replace("/(drawer)/(tabs)/shop")}
            />
            <DrawerItem
              icon={({ color, size }) => <Feather name="user" size={22} color={color} />}
              label={() => <Text style={stylesV2.menuLabel}>My profile</Text>}
              style={stylesV2.menuItem}
              onPress={() => router.replace("/(screen)/profile")}
            />
          </View>
          {/* Other Section */}
          <Text style={stylesV2.otherTitle}>OTHER</Text>
          <View style={stylesV2.menuSection}>
            <DrawerItem
              icon={({ color, size }) => <Feather name="settings" size={22} color={color} />}
              label={() => <Text style={stylesV2.menuLabel}>Setting</Text>}
              style={stylesV2.menuItem}
              onPress={() => router.replace("/(drawer)/(tabs)/setting")}
            />
            <DrawerItem
              icon={({ color, size }) => <Feather name="help-circle" size={22} color={color} />}
              label={() => <Text style={stylesV2.menuLabel}>Support</Text>}
              style={stylesV2.menuItem}
              onPress={() => {}} // Thêm logic nếu có
            />
            <DrawerItem
              icon={({ color, size }) => <Feather name="info" size={22} color={color} />}
              label={() => <Text style={stylesV2.menuLabel}>About us</Text>}
              style={stylesV2.menuItem}
              onPress={() => {}} // Thêm logic nếu có
            />
          </View>
        </DrawerContentScrollView>
        {/* Bottom Light/Dark Switch & Logout */}
        <View style={stylesV2.bottomSection}>
          <View style={stylesV2.themeSwitchContainer}>
            <TouchableOpacity style={[stylesV2.themeButton, { backgroundColor: '#F6F6F6' }]}> 
              <Feather name="sun" size={18} color="#000" />
              <Text style={stylesV2.themeText}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[stylesV2.themeButton, { backgroundColor: '#fff' }]}> 
              <Feather name="moon" size={18} color="#A8A8A9" />
              <Text style={[stylesV2.themeText, { color: '#A8A8A9' }]}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
const stylesV2 = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 18,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F6F6F6',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: '#A8A8A9',
  },
  menuSection: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#fff',
  },
  menuItem: {
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 44,
    justifyContent: 'center',
  },
  menuItemActive: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 0,
    minHeight: 44,
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: '400',
    marginLeft: -16,
  },
  menuLabelActive: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginLeft: -16,
  },
  otherTitle: {
    fontSize: 12,
    color: '#A8A8A9',
    marginTop: 18,
    marginBottom: 2,
    marginLeft: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bottomSection: {
    padding: 16,
    borderTopColor: '#F6F6F6',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    marginBottom: 8,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  themeText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#222',
    fontWeight: '500',
  },
});
