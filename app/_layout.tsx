import { Stack } from "expo-router";
import { CartProvider } from "@/context/contexCart";
import { AuthProvider } from "@/context/contextAuth";
import { ProductProvider } from "@/context/contextProduct";
import { WishlistProvider } from "@/context/WishlistContext";
export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        {/* Đặt WishlistProvider ở đây nếu bạn muốn sử dụng nó trong toàn bộ ứng dụng */}
        <CartProvider>
          <ProductProvider>
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
          </ProductProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
