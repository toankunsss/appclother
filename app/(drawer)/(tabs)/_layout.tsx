import { Tabs } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { View, Text } from "react-native";
import { useCart } from "@/context/contexCart";
import { useNotification } from "@/context/NotificationContext";

export default function TabLayout() {
  const { cartItems } = useCart();
  // Đếm số sản phẩm khác nhau (không cộng quantity)
  const cartCount = cartItems.length;
  const { unreadCount } = useNotification();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          justifyContent: "center",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Roboto",
          fontWeight: "regular",
        },
        tabBarActiveTintColor: "#EB3030",
        tabBarInactiveTintColor: "#000000",
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, size = 24 }) => {
          let iconName = "home";
          switch (route.name) {
            case "home":
              iconName = "home";
              break;
            case "Wishlist":
              iconName = "heart";
              break;
            case "shop":
              iconName = "shopping-cart";
              break;
            case "notification":
              iconName = "bell";
              break;
            case "setting":
              iconName = "settings";
              break;
            default:
              break;
          }

          // Tạo icon cho tab "shop" có viền tròn xung quanh và badge số lượng
          if (route.name === "shop") {
            return (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: focused ? "#EB3030" : "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  top: 2,
                  elevation: focused ? 0 : 0.8,
                }}
              >
                <Feather
                  name={iconName}
                  size={size}
                  color={focused ? "#FFFFFF" : "#000000"}
                />
                {cartCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "#EB3030",
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 10,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>{cartCount}</Text>
                  </View>
                )}
              </View>
            );
          }

          // Các tab khác với màu sắc bình thường
          const iconColor = focused ? "#EB3030" : "#000000";
          return (
            <View>
              <Feather name={iconName} size={size} color={iconColor} />
              {route.name === "notification" && unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    backgroundColor: "#EB3030",
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>{unreadCount}</Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="Wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="shop" options={{ title: "" }} />
      <Tabs.Screen name="notification" options={{ title: "Notifications" }} />
      <Tabs.Screen name="setting" options={{ title: "Settings" }} />
    </Tabs>
  );
}
