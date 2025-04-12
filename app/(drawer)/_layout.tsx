import { Drawer } from "expo-router/drawer";
import { usePathname } from "expo-router";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Feather from "react-native-vector-icons/Feather";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "@/component/header";
import { ggImag } from "@/contants/image/img";
export default function DrawerLayout() {
  const pathname = usePathname();
  // Các trang cần ẩn Drawer
  const hiddenDrawerTabs = ["/search", "/setting", "/shop"];

  const CustomDrawerContent = (props: any) => {
    return (
      <>
        <DrawerContentScrollView {...props}>
          <View style={styles.userInforWrapper}>
            <Image style={styles.imageInforWrapper} source={ggImag} />
            <View style={styles.containerTextInforWrapper}>
              <Text style={styles.textNameInforWrapper}>Hina</Text>
              <Text style={styles.textInforWrapper}>hina@gmail.com</Text>
            </View>
          </View>
          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="home" size={24} color={color} />
            )}
            label={"Home"}
            onPress={() => {}}
          />
        </DrawerContentScrollView>
        <View style={styles.containerFuntion}>
          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="log-out" size={24} color={color} />
            )}
            label={"Log Out"}
            onPress={() => {}}
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
