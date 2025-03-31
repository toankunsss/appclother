import { Text, View, StatusBar, Image } from "react-native";
import { logo } from "@/contants/image/img";
import { useEffect } from "react";
import { useRouter } from "expo-router";
export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(
      () => router.replace("onboarding/Onboarding"),
      2000
    );
    return () => clearTimeout(timeout);
  }, []);
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
    </View>
  );
}
