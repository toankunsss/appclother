import { Stack } from "expo-router";
import { CartProvider } from "@/context/contexCart";
import { AuthProvider } from "@/context/contextAuth";
import { ProductProvider } from "@/context/contextProduct";
import { WishlistProvider } from "@/context/WishlistContext";
import { NotificationProvider } from "@/context/contextNotification";

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <NotificationProvider>
            <ProductProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                  animationDuration: 200,
                  gestureEnabled: true, // Keep gestures enabled by default
                  gestureDirection: "horizontal",
                  presentation: "card",
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="home" />
                <Stack.Screen name="onboarding/Onboarding" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="forgot" />
                <Stack.Screen name="sign-in" />
                <Stack.Screen
                  name="DetailProduct"
                  options={{ gestureEnabled: false }} // Disable swipe for DetailProduct
                />
                <Stack.Screen
                  name="shop"
                  options={{ gestureEnabled: false }} // Disable swipe for shop
                />
              </Stack>
            </ProductProvider>
          </NotificationProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
