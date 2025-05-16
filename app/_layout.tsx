import { Stack } from "expo-router";
import { CartProvider } from "@/context/contexCart";
import { AuthProvider } from "@/context/contextAuth";
import { ProductProvider } from "@/context/contextProduct";
import { WishlistProvider } from "@/context/WishlistContext";
import { AddressProvider } from "@/context/contextAddress";
import {  NotificationProvider } from "@/context/NotificationContext";
export default function Layout() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ProductProvider>
              <AddressProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right", // Hiệu ứng mặc định
                    animationDuration: 200,
                    gestureEnabled: true,
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
                  <Stack.Screen name="DetailProduct" />
                  <Stack.Screen name="shop" /> {/* Thêm shop vào Stack */}
                </Stack>
              </AddressProvider>
            </ProductProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
