import { Stack } from "expo-router";
import { CartProvider } from "@/context/contexCart";
import { AuthProvider } from "@/context/contextAuth";
import { ProductProvider } from "@/context/contextProduct";
export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding/Onboarding" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forgot" />
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="DetailProduct" />
          </Stack>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}
