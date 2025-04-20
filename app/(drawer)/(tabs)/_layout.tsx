import { Tabs } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        swipeEnabled: false, // Disable swipe gestures between tabs
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
            case "search":
              iconName = "bell";
              break;
            case "setting":
              iconName = "user";
              break;
            default:
              break;
          }

          // Tạo icon cho tab "shop" có viền tròn xung quanh
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
              </View>
            );
          }

          // Các tab khác với màu sắc bình thường
          const iconColor = focused ? "#EB3030" : "#000000";
          return <Feather name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="Wishlist" options={{ title: "Wishlist" }} />
      <Tabs.Screen name="shop" options={{ title: "" }} />
      <Tabs.Screen name="search" options={{ title: "Notification" }} />
      <Tabs.Screen name="setting" options={{ title: "user" }} />
    </Tabs>
  );
}
