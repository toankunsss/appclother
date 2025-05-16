import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useAuth } from "@/context/contextAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ggImag, facebookImag, appleImag } from "@/contants/image/img";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

interface FooterProps {
  title: any;
  hrefLink: any;
}

const Footer: React.FC<FooterProps> = ({ title, hrefLink }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const { setUser } = useAuth();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "527712290787-0jfuofloms1qihc0v905q82nsinuaqhv.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri: "https://auth.expo.io/@vantoankunsss/clotherApp",
  });

  useEffect(() => {
    if (!response) {
      console.log("Chưa nhận được phản hồi từ Google");
      return;
    }

    const handleGoogleSignIn = async () => {
      console.log(
        "Phản hồi từ Google Auth:",
        JSON.stringify(response, null, 2)
      );

      if (response?.type === "success") {
        const { id_token: idToken } = response.params;
        if (!idToken) {
          console.error("Không tìm thấy idToken");
          return;
        }
        try {
          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;

          setUserInfo(user);
          setUser(user);
          await AsyncStorage.setItem("user", JSON.stringify(user));
          console.log("Đăng nhập Google thành công:", user.displayName);
        } catch (error) {
          console.error("Lỗi đăng nhập Google:", error);
        }
      } else if (response?.type === "error") {
        console.error("Lỗi từ Google:", response.error);
      } else {
        console.log("Phản hồi không xác định:", response);
      }
    };

    handleGoogleSignIn();
  }, [response, setUser]);

  return (
    <View style={styles.container}>
      <Text>- Hoặc tiếp tục với -</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Image source={facebookImag} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if (request) {
              console.log("Yêu cầu Google Auth:", request);
              try {
                const result = await promptAsync({
                  showInRecents: true,
                });
                console.log("Redirect URI được sử dụng:", request?.redirectUri);
                console.log("Kết quả từ promptAsync:", result);
              } catch (error) {
                console.error("Lỗi khi gọi promptAsync:", error);
              }
            } else {
              console.log("Yêu cầu chưa sẵn sàng");
            }
          }}
          disabled={!request}
        >
          <Image source={ggImag} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={appleImag} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {userInfo ? (
        <Text>Xin chào, {userInfo.displayName}!</Text>
      ) : (
        <Text>
          {title} {hrefLink}
        </Text>
      )}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  iconContainer: {
    flexDirection: "row",
    marginVertical: 20,
    gap: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
