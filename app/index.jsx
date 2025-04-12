import { Text, View, StatusBar, Image } from "react-native";
import { logo } from "@/contants/image/img";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/contextAuth";

export default function Index() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false); // Trạng thái kiểm tra mount

  // Đánh dấu thành phần đã được gắn kết
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Xử lý điều hướng khi đã mount và authLoading hoàn tất
  useEffect(() => {
    if (isMounted && !authLoading) {
      if (user) {
        router.replace("/home");
      } else {
        const timeout = setTimeout(() => {
          router.replace("/sign-in");
        }, 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [isMounted, authLoading, user, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar hidden />
      <Image
        source={logo}
        style={{ width: 300, height: 300, resizeMode: "contain" }}
      />
      <Text>Loading...</Text>
    </View>
  );
}
